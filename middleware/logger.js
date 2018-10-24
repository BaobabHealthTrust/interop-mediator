const { info, error } = require("winston");

module.exports = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  info(`Processing ${req.method} request on ${req.url} from ${ip}`)
  next()
}
