'use strict'
const URL = require('url')

exports.buildOrchestration = (name, beforeTimestamp, method, url, requestHeaders, requestContent, res, body) => {
 console.log('orch res headers')
 console.log(res.headers); 
 let uri = URL.parse(url)
  return {
    name: name,
    request: {
      method: method,
      headers: requestHeaders,
      body: requestContent,
      timestamp: beforeTimestamp,
      path: uri.path,
      querystring: uri.query
    },
    response: {
      status: res.statusCode,
      headers: {...res.headers, "Access-Control-Allow-Origin": "http://142.93.203.254:3001", "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization", "Access-Control-Allow-Credentials": true, "Access-Control-Allow-Methods": "OPTIONS"},
      body: body,
      timestamp: new Date()
    }
  }
}

exports.buildReturnObject = (urn, status, statusCode, headers, responseBody, orchestrations, properties) => {
  var response = {
    status: statusCode,
    headers: {...headers, "Access-Control-Allow-Origin": "http://142.93.203.254:3001", "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization", "Access-Control-Allow-Credentials": true, "Access-Control-Allow-Methods": "OPTIONS"},
    body: responseBody,
    timestamp: new Date().getTime()
  }

  return {
    'x-mediator-urn': urn,
    status: status,
    response: response,
    orchestrations: orchestrations,
    properties: properties
  }
}
