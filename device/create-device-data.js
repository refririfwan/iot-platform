const { nanoid } = require('nanoid')
const AWS = require('aws-sdk')
const sendResponse = require('../utils/response')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async(event) => {
  try{
    const data = JSON.parse(event.body)
    const deviceId = data.deviceId
    const dataId = nanoid()
    const timestamp = new Date().toISOString()
    const temp = data.temp
    const humidity = data.humidity
    const batteryLevel = data.batteryLevel
    const lcd = data.lcd

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: 'device#'+deviceId,
        metadata: 'data#'+dataId,
        device_id: deviceId,
        data_id: dataId,
        created_at: timestamp,
        updated_at: '',
        temp: temp,
        humidity: humidity,
        battery_level: batteryLevel,
        lcd: lcd,
        timestamp: timestamp
      }
    }

    await dynamoDb.put(params).promise()

    return sendResponse(201, {
      message: 'Device data has been created',
      data: params.Item
    })
  }
  catch (error){
    const message = error.message ? error.message : 'Internal server error'
    return sendResponse(500, {message})
  }
}