const { error } = require("winston");

module.exports = (err, req, res, next) => {
  error(err);
  res.status(err.status || 500).send({ error: "internal server error" });
};
