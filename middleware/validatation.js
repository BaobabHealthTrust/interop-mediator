const { error } = require("winston");
const Joi = require("joi");

module.exports = (schema = {}) => {
  return (req, res, next) => {
    const { error: err } = Joi.validate(req.body, schema);

    if (err) {
      error(err);
      return res.status(400).send(err.details[0].message);
    }

    next();
  };
};
