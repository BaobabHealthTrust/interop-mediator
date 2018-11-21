const Joi = require('joi')

module.exports = Joi.object().keys({
  period: Joi.string().min(7).required()
})
