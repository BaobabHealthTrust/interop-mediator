const _ = require("lodash");
const { info, error } = require("winston");
const Joi = require("joi");

const utils = require("../lib/utils");
const { urn } = require("../config/mediator.json");
const { Synchronization: Sync } = require("../models");
const OrchestrationRegister = require("../lib/OrchestrationRegister");
const PropertiesRegister = require("../lib/PropertiesRegister");

module.exports.getSynchronizations = async (req, res) => {
  const clientId = req.client;

  const selectOption = [
    "totalFacilitiesAdded",
    "totalFacilitiesRemoved",
    "totalFacilitiesUpdated",
    "synchronizationDate",
    "isSuccessful",
    "_id"
  ];

  const syncs = await Sync.find({ clientId }).select(selectOption).sort({'synchronizationDate': 'desc'});
  const OrchestrationMessage = "Get synchronizations form mongo database";
  OrchestrationRegister.add(req, OrchestrationMessage, syncs, 200);

  PropertiesRegister.add("client", clientId);
  PropertiesRegister.add("synchronizations", syncs.length);

  res.set("Content-Type", "application/json+openhim");
  
 res.send(
    utils.buildReturnObject(
      urn,
      "Successful",
      200,
      {},
      JSON.stringify(syncs),
      OrchestrationRegister.orchestrations,
      PropertiesRegister.properties
    )
  );
};

module.exports.getSynchronization = async (req, res) => {
  const clientId = req.client;
  const sync = await Sync.findById(req.params.id);

  if (!sync) {
    const errorMessage = "A synchronization with the given ID was not found.";
    error(errorMessage);
    return res.status(404).send(errorMessage);
  }

  const OrchestrationMessage = "Get a synchronization form mongo database";
  OrchestrationRegister.add(req, OrchestrationMessage, sync, 200);

  const {
    totalFacilitiesAdded = 0,
    totalFacilitiesRemoved = 0,
    totalFacilitiesUpdated = 0,
    synchronizationDate = 0,
    isSuccessful = false,
    facilities = []
  } = sync;

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
      JSON.stringify(sync),
      OrchestrationRegister.orchestrations,
      PropertiesRegister.properties
    )
  );
};

module.exports.addSynchronization = async (req, res) => {
  const clientId = req.client;

  const pickOptions = [
    "totalFacilitiesAdded",
    "totalFacilitiesRemoved",
    "totalFacilitiesUpdated",
    "isSuccessful",
    "facilities"
  ];

  const sync = new Sync(_.pick(req.body, pickOptions));
  sync.clientId = clientId;
  await sync.save();

  OrchestrationRegister.add(req, "Added a sync in the database", sync, 200);

  const {
    totalFacilitiesAdded = 0,
    totalFacilitiesRemoved = 0,
    totalFacilitiesUpdated = 0,
    synchronizationDate = 0,
    isSuccessful = false,
    facilities = []
  } = sync;

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
      JSON.stringify(sync),
      OrchestrationRegister.orchestrations,
      PropertiesRegister.properties
    )
  );
};
