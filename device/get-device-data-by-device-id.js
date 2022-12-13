const AWS = require('aws-sdk')
const sendResponse = require('../utils/response')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
    try {
        const { deviceId } = event.pathParameters
        const id = 'device#'+deviceId
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            ScanIndexForward: true,
            ConsistentRead: false,
            KeyConditionExpression: "#id = :id",
            FilterExpression: "attribute_exists(#data_id)",
            ExpressionAttributeNames: {"#id":"id", "#data_id":"data_id"},
            ExpressionAttributeValues: {":id": id}
        }
        const device = await dynamoDb.query(params).promise()

        return sendResponse(200, { message: 'Device data fetched successfully', data: device.Items })
    }
    catch (error) {
        const message = error.message ? error.message : 'Internal server error'
        return sendResponse(500, { message })
    }
}