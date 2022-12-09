const AWS = require('aws-sdk')
const sendResponse = require('../utils/response')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
  try {
    const { email, userId } = event.pathParameters
    const id = 'email#'+email
    const metadata = 'user#'+userId
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: id,
        metadata: metadata
      }
    }
    await dynamoDb.delete(params).promise()
    return sendResponse(200, { message: 'Success delete data user' })
  }
  catch (error) {
    const message = error.message ? error.message : 'Internal server error'
    return sendResponse(500, { message })
  }
}