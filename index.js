const { info } = require('winston')
const express = require('express')
const Joi = require('joi')

const app = express()

/** load environmental variables */
require('dotenv').config()

/** Handle express async await errors */
require('express-async-errors')

/** Add mongo object id validation to Joi */
Joi.objectId = require('joi-objectid')(Joi)

/** set up some configure */
require('./helpers').configureLogger()
require('./helpers').configureDatabase()
require('./helpers').configureMediator()

/** setting middlewares*/
require('./helpers').configureExpressMiddlewares(app)

/** add routes */
require('./routes')(app)

// /** start a server */
const { port } = require('config') || 4001
const server = app.listen(port, () => info(`Listening on : ${port}...`))

module.exports = server
