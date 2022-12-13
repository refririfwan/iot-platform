const { nanoid } = require('nanoid')
const AWS = require('aws-sdk')
const sendResponse = require('../utils/response')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body)
    const userId = data.userId
    const deviceName = data.deviceName
    const ip = data.ip
    const cca2 = data.cca2
    const cca3 = data.cca3
    const cn = data.cn
    const scale = data.scale
    const latitude = data.latitude
    const longitude = data.longitude
    const deviceId = nanoid()
    const timestamp = new Date().toISOString()

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: 'user#'+userId,
        metadata: 'device#'+deviceId,
        user_id: userId,
        device_id: deviceId,
        created_at: timestamp,
        updated_at: '',
        device_name: deviceName,
        ip: ip,
        cca2: cca2,
        cca3: cca3,
        cn: cn,
        scale: scale,
        latitude: latitude,
        longitude: longitude
      }
    }

    await dynamoDb.put(params).promise()

    return sendResponse(201,
        {
          message: 'Device has been created',
          data: params.Item
        }
      )
  }
  catch (error) {
    const message = error.message ? error.message : 'Internal server error'
    return sendResponse(500, {message})
  }
}