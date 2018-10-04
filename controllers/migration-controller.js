const { Migration } = require('../models')
const utils = require('../lib/utils')

module.exports = module.exports = (req, res) => {
  winston.info(`Processing ${req.method} request on ${req.url}`)
  var responseBody = 'Primary Route Reached'
  var headers      = {
    'content-type': 'application/json'
  }

  // add logic to alter the request here

  // capture orchestration data
  var orchestrationResponse = {
    statusCode: 200,
    headers   : headers
  }
  let orchestrations = []

  orchestrations.push(utils.buildOrchestration(
    'Primary Route',
    new Date().getTime(),
    req.method,
    req.url,
    req.headers,
    req.body,
    orchestrationResponse,
    responseBody
  ))

  // set content type header so that OpenHIM knows how to handle the response
  res.set('Content-Type', 'application/json+openhim')

  // construct return object
  var properties = {
    property: 'Primary Route'
  }

  res.send(utils.buildReturnObject(
    mediatorConfig.urn,
    'Successful',
    200,
    headers,
    responseBody,
    orchestrations,
    properties
  ))
}
