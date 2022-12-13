const AWS = require('aws-sdk')
const sendResponse = require('../utils/response')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body)
    const id = 'device#'+data.deviceId
    const metadata = 'data#'+data.dataId
    const timestamp = new Date().toISOString()
    const temp = data.temp
    const humidity = data.humidity
    const batteryLevel = data.batteryLevel
    const lcd = data.lcd

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: id,
        metadata: metadata
      },
      UpdateExpression: "SET #updated_at = :updated_at, #temp = :temp, #humidity = :humidity, #battery_level = :battery_level, #lcd = :lcd, #timestamp = :timestamp",
      ExpressionAttributeNames: {"#updated_at":"updated_at", "#temp":"temp", "#humidity":"humidity", "#battery_level":"battery_level", "#lcd":"lcd", "#timestamp":"timestamp"},
      ExpressionAttributeValues: {":updated_at": timestamp, ":temp": temp, ":humidity": humidity, ":battery_level": batteryLevel, ":lcd": lcd, ":timestamp": timestamp}
    }
    await dynamoDb.update(params).promise()
    return sendResponse(201, {message: 'Success updated device data'})
  }
  catch (error) {
    const message = error.message ? error.message : 'Internal server error'
    return sendResponse(500, { message })
  }
}