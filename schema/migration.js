const Joi = require('joi')

module.exports = Joi.object().keys({
  quarter: Joi.number().valid(1, 2, 3, 4).required(),
  year: Joi.number().required()
})
