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
    const user = await dynamoDb.get(params).promise()
    return sendResponse(200, { message: 'Success', data: user.Item })
  }
  catch (error) {
    const message = error.message ? error.message : 'Internal server error'
    return sendResponse(500, { message })
  }
}