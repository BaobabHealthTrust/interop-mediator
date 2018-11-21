const { error } = require('winston')
const express = require('express')
const morgan = require('morgan')

const { client } = require('../middleware')

module.exports = (app = null) => {
  if (!app) {
    error('Failed to create mediator routes')
    return
  }

  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb', extended: false }))

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
  }
  app.use(client)
}
