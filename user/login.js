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
        const { USERS_POOL_ID, CLIENT_ID } = process.env
        const params = {
            AuthFlow: "ADMIN_NO_SRP_AUTH",
            UserPoolId: USERS_POOL_ID,
            ClientId: CLIENT_ID,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        }
        const response = await cognito.adminInitiateAuth(params).promise();

        // get user data from dynamodb
        const id = 'email#'+email
        const userParams = {
            TableName: process.env.DYNAMODB_TABLE,
            KeyConditionExpression: "#id = :id",
            ExpressionAttributeNames: {"#id":"id"},
            ExpressionAttributeValues: {":id": id}
        }
        const user = await dynamoDb.query(userParams).promise()

        return sendResponse(200, { message: 'User login successful', token: response.AuthenticationResult.IdToken, data: user.Items })
    }
    catch (error) {
        const message = error.message ? error.message : 'Internal server error'
        return sendResponse(500, { message })
    }
}