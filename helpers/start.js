const medUtils = require('openhim-mediator-utils')
const { info, error }   = require('winston')
const { api, register } = require('config')
const mediatorConfig    = require('../config/mediator.json')

module.exports = callback => {
  const { trustSelfSigned, heartbeat } = api

  if (trustSelfSigned) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }

  if (register) {
    medUtils.registerMediator(api, mediatorConfig, (err) => {
      if (err) {
        error('Failed to register this mediator, check your config')
        error(err.stack)
        process.exit(1)
      }

      api.urn = mediatorConfig.urn
      medUtils.fetchConfig(api, (err, config) => {
        info('Received initial config:')
        info(JSON.stringify(config))

        if (err) {
          error('Failed to fetch initial config')
          error(err.stack)
          process.exit(1)
        } else {
          info('Successfully registered mediator!')
          if (heartbeat) {
            let configEmitter = medUtils.activateHeartbeat(api)
            configEmitter.on('config', (config) => {
              info('Received updated config:')
              info(JSON.stringify(config))
              info(config)
            })
          }
        }
      })
    })
  }
}
