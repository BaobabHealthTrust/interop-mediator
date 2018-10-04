const { info, error } = require('winston')
const utils = require('../lib/utils')
const mediatorConfig = require('../config/mediator.json')

module.exports.getSynchronizations = async (req, res) => {
  info(`Processing ${req.method} request on ${req.url}`)
  const urn = mediatorConfig.urn

  var responseBody = JSON.stringify({ 'message': 'put your data here' })

  let orchestrations = []

  res.set('Content-Type', 'application/json+openhim')

  const properties = {}

  res.send(utils.buildReturnObject(
    mediatorConfig.urn,
    'Successful', 200,
    {},
    responseBody,
    orchestrations,
    properties
  ))
}
