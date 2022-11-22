const sendResponse = require('../utils/response')

module.exports.handler = async (event) => {
    return sendResponse(200, { message: `Email ${event.requestContext.authorizer.claims.email} has been authorized` })
}