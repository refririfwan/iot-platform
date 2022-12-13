const AWS = require('aws-sdk')
const sendResponse = require('../utils/response')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
  try {
    const { deviceId, dataId } = event.pathParameters
    const id = 'device#'+deviceId
    const metadata = 'data#'+dataId
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: id,
        metadata: metadata
      }
    }
    await dynamoDb.delete(params).promise()
    return sendResponse(200, { message: 'Success delete device data' })
  }
  catch (error) {
    const message = error.message ? error.message : 'Internal server error'
    return sendResponse(500, { message })
  }
}