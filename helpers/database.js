const mongoose = require('mongoose')
const { info, error } = require('winston')

const { database } = require('config')

module.exports = () => {
  mongoose
    .connect(database, { useNewUrlParser: true })
    .then(() => info(`connected to ${database}`))
    .catch(err => error(`Mongoose connection error: ${err}`))

  mongoose.Promise = global.Promise
}
