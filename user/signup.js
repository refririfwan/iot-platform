const { nanoid } = require('nanoid');
const AWS = require('aws-sdk')
const sendResponse = require('../utils/response')
const validateInput = require('../utils/validation')
const cognito = new AWS.CognitoIdentityServiceProvider()
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
    try {
        const isValid = validateInput(event.body)
        if (!isValid)
            return sendResponse(400, { message: 'Invalid input' })

        const { email, password } = JSON.parse(event.body)
        const { USERS_POOL_ID } = process.env
        const params = {
            UserPoolId: USERS_POOL_ID,
            Username: email,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email
                },
                {
                    Name: 'email_verified',
                    Value: 'true'
                }],
            MessageAction: 'SUPPRESS'
        }
        const response = await cognito.adminCreateUser(params).promise()
        if (response.User) {
            const paramsForSetPass = {
                Password: password,
                UserPoolId: USERS_POOL_ID,
                Username: email,
                Permanent: true
            };
            await cognito.adminSetUserPassword(paramsForSetPass).promise()
        }
        const userId = nanoid()
        const timestamp = new Date().toISOString()

        // create params data user for dynamodb
        const userParams = {
          TableName: process.env.DYNAMODB_TABLE,
          Item: {
            id: 'email#'+email,
            metadata: 'user#'+ userId,
            email: email,
            user_id: userId,
            created_at: timestamp,
            updated_at: '',
          },
        }

        // put item data user in dynamodb
        await dynamoDb.put(userParams).promise()

        // create params data user detail for dynamodb
        const userDetailParams = {
          TableName: process.env.DYNAMODB_TABLE,
          Item: {
            id: 'user#'+ userId,
            metadata: 'email#'+ email,
            user_id: userId,
            email: email,
            created_at: timestamp,
            updated_at: '',
            name: '',
            phone_number: '',
            address: '',
            city: '',
            province: '',
            country: '',
            zip_code: '',
          },
        }

        // put item data user detail in dynamodb
        await dynamoDb.put(userDetailParams).promise()

        return sendResponse(201, { message: 'User registration successful' })
    }
    catch (error) {
        const message = error.message ? error.message : 'Internal server error'
        return sendResponse(500, { message })
    }
}