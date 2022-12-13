const AWS = require('aws-sdk')
const sendResponse = require('../utils/response')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body)
    const id = 'user#'+ data.userId
    const metadata = 'email#'+ data.email
    const timestamp = new Date().toISOString();
    const name = data.name
    const address = data.address
    const city = data.city
    const province = data.province
    const country = data.country
    const zip_code = data.zipCode
    const phone_number = data.phoneNumber
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: id,
        metadata: metadata
      },
      UpdateExpression: "SET #updated_at = :updated_at, #name = :name, #address = :address, #city = :city, #province = :province, #country = :country, #zip_code = :zip_code, #phone_number = :phone_number",
      ExpressionAttributeNames: {"#updated_at":"updated_at","#name":"name","#address":"address","#city":"city","#province":"province","#country":"country","#zip_code":"zip_code","#phone_number":"phone_number"},
      ExpressionAttributeValues: {":updated_at": timestamp, ":name": name, ":address": address, ":city": city, ":province": province, ":country": country, ":zip_code": zip_code, ":phone_number": phone_number}
    }
    await dynamoDb.update(params).promise()
    return sendResponse(201, { message: 'Success updated data user detail' })
  }
  catch (error) {
    const message = error.message ? error.message : 'Internal server error'
    return sendResponse(500, { message })
  }
}