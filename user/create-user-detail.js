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
      }
    }

    await dynamoDb.put(params).promise()

    return sendResponse(201, 
      { 
        message: 'User detail has been created', 
        data: params.Item
      }
    )
  }
  catch (error) {
    const message = error.message ? error.message : 'Internal server error'
    return sendResponse(500, { message })
  }
}