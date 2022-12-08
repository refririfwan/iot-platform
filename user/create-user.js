const { nanoid } = require('nanoid')
const AWS = require('aws-sdk')
const sendResponse = require('../utils/response')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body)
    const userId = nanoid()
    const email = data.email
    const timestamp = new Date().toISOString();

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: 'email#'+ email,
        metadata: 'user#'+ userId,
        user_id: userId,
        email: email,
        created_at: timestamp,
        updated_at: ''
      }
    }

    await dynamoDb.put(params).promise()

    return sendResponse(201, 
      { 
        message: 'User has been created', 
        data: params.Item
      }
    )
  }
  catch (error) {
    const message = error.message ? error.message : 'Internal server error'
    return sendResponse(500, { message })
  }
}