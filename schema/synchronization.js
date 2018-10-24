const Joi = require("joi");

const facilityFieldStringValidation = {
  previousValue: Joi.string().allow(null).required(),
  newValue: Joi.string().allow(null).required()
};

const facilityFieldDateValidation = {
  previousValue: Joi.date().allow(null).required(),
  newValue: Joi.date().allow(null).required()
};

const facilitiesSchema = Joi.object().keys({
  Name: Joi.object().keys(facilityFieldStringValidation),
  CommonName: Joi.object().keys(facilityFieldStringValidation),
  Code: Joi.object().keys(facilityFieldStringValidation),
  OperationalStatus: Joi.object().keys(facilityFieldStringValidation),
  RegulatoryStatus: Joi.object().keys(facilityFieldStringValidation),
  DateOpened: Joi.object().keys(facilityFieldDateValidation),
  LastUpdated: Joi.object().keys(facilityFieldDateValidation),
  DHIS2Code: Joi.object().keys(facilityFieldStringValidation),
  OpenLMISCode: Joi.object().keys(facilityFieldStringValidation),
  District: Joi.object().keys(facilityFieldStringValidation),
  Zone: Joi.object().keys(facilityFieldStringValidation),
  isNew: Joi.boolean().required(),
  isRemoved: Joi.boolean().required()
});

module.exports = Joi.object().keys({
  totalFacilitiesAdded: Joi.number().positive().required(),
  totalFacilitiesRemoved: Joi.number().positive().required(),
  totalFacilitiesUpdated: Joi.number().positive().required(),
  isSuccessful: Joi.boolean().valid([true, false]).required(),
  facilities: Joi.array().items(facilitiesSchema).required()
});
