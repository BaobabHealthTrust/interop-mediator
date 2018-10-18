const mongoose = require("mongoose");
const { info, error } = require("winston");

const { database } = require("config");

module.exports = () => {
  mongoose.Promise = global.Promise;
  mongoose
    .connect(
      database,
      { useNewUrlParser: true }
    )
    .then(() => info(`connected to ${database}`))
    .catch(err => error(`Mongoose connection error: ${err}`));
};
