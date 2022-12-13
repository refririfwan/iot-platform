const AWS = require('aws-sdk')
const sendResponse = require('../utils/response')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
  try{
    const data = JSON.parse(event.body)
    const id = 'user#'+data.userId
    const metadata = 'device#'+data.deviceId
    const timestamp = new Date().toISOString();
    const device_name = data.deviceName 
    const ip = data.ip
    const cca2 = data.cca2
    const cca3 = data.cca3
    const cn = data.cn
    const scale = data.scale
    const latitude = data.latitude
    const longitude = data.longitude

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: id,
        metadata: metadata
      },
      UpdateExpression: "SET #updated_at = :updated_at, #device_name = :device_name, #ip = :ip, #cca2 = :cca2, #cca3 = :cca3, #cn = :cn, #scale = :scale, #latitude = :latitude, #longitude = :longitude",
      ExpressionAttributeNames: {"#updated_at":"updated_at","#device_name":"device_name", "#ip":"ip", "#cca2":"cca2", "#cca3":"cca3", "#cn":"cn", "#scale":"scale", "#latitude":"latitude", "#longitude":"longitude"},
      ExpressionAttributeValues: {":updated_at": timestamp,":device_name": device_name, ":ip": ip, ":cca2": cca2, ":cca3": cca3, ":cn": cn, ":scale": scale, ":latitude": latitude, ":longitude": longitude}
    }
    await dynamoDb.update(params).promise()
    return sendResponse(201, {message: 'Success updated device' })
  }
  catch (error){
    const message = error.message ? error.message : 'Internal server error'
    return sendResponse(500, { message })
  }
}