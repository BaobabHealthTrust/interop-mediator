const { info } = require('winston')
const express = require('express')
const morgan = require('morgan')

require('dotenv').config()

const {
  logger: configureWinston,
  start: configureMediator,
  database: configureDatabase
} = require('./helpers')

const { migration, synchronization } = require('./routes')

require('express-async-errors')


configureWinston()
configureDatabase()
configureMediator()

const app = express()

/** setting middlewares */
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// /** add routes */
app.use('/interop-manager', synchronization)
// app('/interop-manager', migration)

// /** start a server */
const { port } = require('config')
const server = app.listen(port, () => info(`Listening on : ${port}...`))

module.exports = server
