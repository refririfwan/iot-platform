const AWS = require('aws-sdk')
const sendResponse = require('../utils/response')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body)
    const id = 'email#'+data.email
    const metadata = 'user#'+data.userId
    const timestamp = new Date().toISOString()
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: id,
        metadata: metadata
      },
      UpdateExpression: "SET #updated_at = :updated_at",
      ExpressionAttributeNames: {"#updated_at":"updated_at"},
      ExpressionAttributeValues: {":updated_at": timestamp}
    }
    await dynamoDb.update(params).promise()
    return sendResponse(201, { message: 'Success updated data user' })
  }
  catch (error) {
    const message = error.message ? error.message : 'Internal server error'
    return sendResponse(500, { message })
  }
}