const { transports, configure, format, exceptions } = require('winston')

const console = new transports.Console({ colorize: true, prettyPrint: true })

module.exports = function () {
  const level = process.env.LOG_LEVEL

  const options = {
    level,
    format: format.combine(
      format.colorize({
        all: true
      }),
      format.simple()
    ),
    transports: [console]
  }

  configure(options)
  exceptions.handle(console)
}
