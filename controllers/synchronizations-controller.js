const _ = require("lodash");
const { info, error } = require("winston");
const Joi = require("joi");

const utils = require("../lib/utils");
const { urn } = require("../config/mediator.json");
const OrchestrationRegister = require("../lib/OrchestrationRegister");
const PropertiesRegister = require("../lib/PropertiesRegister");
const { Synchronization } = require("../models");

module.exports.getSynchronizations = async (req, res) => {
  info(`Processing ${req.method} request on ${req.url}`);
  const clientId = req.client;

  const selectOption = [
    "totalFacilitiesAdded",
    "totalFacilitiesRemoved",
    "totalFacilitiesUpdated",
    "synchronizationDate",
    "isSuccessful",
    "_id"
  ];

  const synchronizations = await Synchronization.find({ clientId }).select(
    selectOption
  );

  const message = "Get synchronizations form mongo database";
  OrchestrationRegister.add(req, message, synchronizations, 200);

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

  const clientId = req.client;

  const schema = Joi.object().keys({ id: Joi.objectId().required() });
  const { error } = Joi.validate(req.params, schema);
  if (error) return res.status(400).send(error.details[0].message);

  const message = "A synchronization with the given ID was not found.";
  const synchronization = await Synchronization.findById(req.params.id);
  if (!synchronization) return res.status(404).send(message);

  OrchestrationRegister.add(
    req,
    "Get a synchronization from the database",
    synchronization,
    200
  );

  const {
    totalFacilitiesAdded = 0,
    totalFacilitiesRemoved = 0,
    totalFacilitiesUpdated = 0,
    synchronizationDate = 0,
    isSuccessful = false,
    facilities = []
  } = synchronization;

  PropertiesRegister.add("client", clientId);
  PropertiesRegister.add("Status", isSuccessful);
  PropertiesRegister.add("Synchronization Date", synchronizationDate);
  PropertiesRegister.add("Total Facilities Added", totalFacilitiesAdded);
  PropertiesRegister.add("Total Facilities Updated", totalFacilitiesUpdated);
  PropertiesRegister.add("Total Facilities Removed", totalFacilitiesRemoved);

  res.set("Content-Type", "application/json+openhim");
  res.send(
    utils.buildReturnObject(
      urn,
      "Successful",
      200,
      {},
      JSON.stringify(synchronization),
      OrchestrationRegister.orchestrations,
      PropertiesRegister.properties
    )
  );
};

module.exports.addSynchronization = async (req, res) => {
  info(`Processing ${req.method} request on ${req.url}`);

  const clientId = req.get("x-openhim-clientid");
  const orchestrations = [];

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

  OrchestrationRegister.add(
    req,
    "Added a sync in the database",
    synchronization,
    200
  );

  const {
    totalFacilitiesAdded = 0,
    totalFacilitiesRemoved = 0,
    totalFacilitiesUpdated = 0,
    synchronizationDate = 0,
    isSuccessful = false,
    facilities = []
  } = synchronization;

  PropertiesRegister.add("client", clientId);
  PropertiesRegister.add("Status", isSuccessful);
  PropertiesRegister.add("Synchronization Date", synchronizationDate);
  PropertiesRegister.add("Total Facilities Added", totalFacilitiesAdded);
  PropertiesRegister.add("Total Facilities Updated", totalFacilitiesUpdated);
  PropertiesRegister.add("Total Facilities Removed", totalFacilitiesRemoved);

  res.set("Content-Type", "application/json+openhim");
  res.send(
    utils.buildReturnObject(
      urn,
      "Successful",
      200,
      {},
      JSON.stringify(synchronization),
      OrchestrationRegister.orchestrations,
      PropertiesRegister.properties
    )
  );
};
