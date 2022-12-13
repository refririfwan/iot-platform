const AWS = require('aws-sdk')
const sendResponse = require('../utils/response')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
    try {
        const { email } = event.pathParameters
        const id = 'email#'+email
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            KeyConditionExpression: "#id = :id",
            ExpressionAttributeNames: {"#id":"id"},
            ExpressionAttributeValues: {":id": id}
        }
        const user = await dynamoDb.query(params).promise()

        return sendResponse(200, { message: 'User fetched successfully', data: user.Items })
    }
    catch (error) {
        const message = error.message ? error.message : 'Internal server error'
        return sendResponse(500, { message })
    }
}