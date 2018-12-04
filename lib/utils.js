'use strict'
const URL = require('url')
const requestIp = require('request-ip')

const getClientIp = (req) => {
  if (req) {
    return req.origin
  }
  return ''
}

exports.buildOrchestration = (name, beforeTimestamp, method, url, requestHeaders, requestContent, res, body, req = null) => {
  // response headers

  const headers = {
    ...res.headers,
    'Access-Control-Allow-Origin': getClientIp(req),
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'OPTIONS'
  }

  console.log(headers)

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
      headers,
      body: body,
      timestamp: new Date()
    }
  }
}

exports.buildReturnObject = (urn, status, statusCode, headers, responseBody, orchestrations, properties, req = null) => {
  const _headers = {
    ...headers,
    'Access-Control-Allow-Origin': getClientIp(req),
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'OPTIONS'
  }
  console.log(_headers)
  var response = {
    status: statusCode,
    headers: _headers,
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
