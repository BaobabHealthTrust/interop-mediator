const _ = require("lodash");
const { info, error } = require("winston");
const Joi = require("joi");

const utils = require("../lib/utils");
const { urn } = require("../config/mediator.json");
const OrchestrationRegister = require("../lib/OrchestrationRegister");
const PropertiesRegister = require("../lib/PropertiesRegister");
const { Synchronization } = require("../models");

module.exports.get = async (req, res) => {
  info(`Processing ${req.method} request on ${req.url}`);
  var responseBody = { message: "put your data here" };

  OrchestrationRegister.add(req, responseBody, 200);
  PropertiesRegister.add("name", "Property value");

  res.set("Content-Type", "application/json+openhim");
  res.send(
    utils.buildReturnObject(
      urn,
      "Successful",
      200,
      {},
      JSON.stringify(responseBody),
      OrchestrationRegister.orchestrations,
      PropertiesRegister.properties
    )
  );
};

module.exports.getSynchronizations = async (req, res) => {
  info(`Processing ${req.method} request on ${req.url}`);

  const clientId = req.client;
  const synchronizations = await Synchronization.find({ clientId }).select(
    selectOption
  );

  OrchestrationRegister.add(req, synchronizations, 200);

  PropertiesRegister.add("client", clientId);
  PropertiesRegister.add("synchronizations", synchronizations.length);

  res.set("Content-Type", "application/json+openhim");
  res.send(
    utils.buildReturnObject(
      urn,
      "Successful",
      200,
      {},
      JSON.stringify(synchronizations),
      OrchestrationRegister.orchestrations,
      PropertiesRegister.properties
    )
  );
};

module.exports.getSynchronization = async (req, res) => {
  info(`Processing ${req.method} request on ${req.url}`);

  const clientId = req.get("x-openhim-clientid");
  const orchestrations = [];

  const schema = Joi.object().keys({ id: Joi.objectId().required() });
  const { error } = Joi.validate(req.params, schema);
  if (error) return res.status(400).send(error.details[0].message);

  const message = "A synchronization with the given ID was not found.";
  const synchronization = await Synchronization.findById(req.params.id);
  if (!synchronization) return res.status(404).send(message);

  const responseBody = synchronization;

  res.set("Content-Type", "application/json+openhim");

  const {
    totalFacilitiesAdded = 0,
    totalFacilitiesRemoved = 0,
    totalFacilitiesUpdated = 0,
    synchronizationDate = 0,
    isSuccessful = false,
    facilities = []
  } = synchronization;

  const properties = {
    clientId,
    isSuccessful,
    synchronizationDate,
    totalFacilitiesAdded,
    totalFacilitiesUpdated,
    totalFacilitiesRemoved,
    facilities: facilities.length
  };

  info(`Response: [${res.statusCode}] ${responseBody}`);

  res.send(
    utils.buildReturnObject(
      urn,
      "Successful",
      200,
      {},
      responseBody,
      orchestrations,
      properties
    )
  );
};

module.exports.addSynchronization = async (req, res) => {
  info(`Processing ${req.method} request on ${req.url}`);

  const clientId = req.get("x-openhim-clientid");
  const orchestrations = [];

  const facilityFieldStringValidation = {
    previousValue: Joi.string().required(),
    newValue: Joi.string().required()
  };

  const facilityFieldDateValidation = {
    previousValue: Joi.date().required(),
    newValue: Joi.date().required()
  };

  const facilitiesSchema = Joi.object().keys({
    name: Joi.object().keys(facilityFieldStringValidation),
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
    isCreated: Joi.boolean().required(),
    isRemoved: Joi.boolean().required()
  });

  const schema = Joi.object().keys({
    totalFacilitiesAdded: Joi.number()
      .positive()
      .required(),
    totalFacilitiesRemoved: Joi.number()
      .positive()
      .required(),
    totalFacilitiesUpdated: Joi.number()
      .positive()
      .required(),
    isSuccessful: Joi.boolean()
      .valid([true, false])
      .required(),
    facilities: Joi.array()
      .items(facilitiesSchema)
      .required()
  });

  const { error } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send(error.details[0].message);

  const synchronizationFields = [
    "totalFacilitiesAdded",
    "totalFacilitiesRemoved",
    "totalFacilitiesUpdated",
    "isSuccessful",
    "facilities"
  ];
  const synchronization = new Synchronization(
    _.pick(req.body, synchronizationFields)
  );
  synchronization.clientId = clientId;
  await synchronization.save();
  const responseBody = synchronization;
  res.set("Content-Type", "application/json+openhim");

  const {
    totalFacilitiesAdded = 0,
    totalFacilitiesRemoved = 0,
    totalFacilitiesUpdated = 0,
    synchronizationDate = 0,
    isSuccessful = false,
    facilities = []
  } = synchronization;

  const properties = {
    clientId,
    isSuccessful,
    synchronizationDate,
    totalFacilitiesAdded,
    totalFacilitiesUpdated,
    totalFacilitiesRemoved,
    facilities: facilities.length
  };

  info(`Response: [${res.statusCode}] ${responseBody}`);

  res.send(
    utils.buildReturnObject(
      urn,
      "Successful",
      200,
      {},
      responseBody,
      orchestrations,
      properties
    )
  );
};
