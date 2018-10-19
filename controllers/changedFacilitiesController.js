const _ = require("lodash");
const { info, error } = require("winston");
const Joi = require("joi");
const request = require("axios");

const utils = require("../lib/utils");
const { urn } = require("../config/mediator.json");
const OrchestrationRegister = require("../lib/OrchestrationRegister");
const PropertiesRegister = require("../lib/PropertiesRegister");
const { Synchronization } = require("../models");

module.exports = async (req, res) => {
  info(`Processing ${req.method} request on ${req.url}`);
  const clientId = req.client;

  // get last sync
  const {
    facilities: lastSynchronizationFacilities
  } = await Synchronization.findOne({ clientId }).sort({
    synchronizationDate: -1
  });

  const prepareFacilities = facility => {
    return {
      Name: facility.Name.newValue,
      CommonName: facility.CommonName.newValue,
      Code: facility.Code.newValue,
      OperationalStatus: facility.OperationalStatus.newValue,
      RegulatoryStatus: facility.RegulatoryStatus.newValue,
      DateOpened: facility.DateOpened.newValue,
      LastUpdated: facility.LastUpdated.newValue,
      DHIS2Code: facility.DHIS2Code.newValue,
      OpenLMISCode: facility.OpenLMISCode.newValue,
      District: facility.District.newValue,
      Zone: facility.Zone.newValue,
      isNew: facility.isNew,
      isNew: facility.isRemoved
    };
  };

  const preparedMediatorFacilities = lastSynchronizationFacilities.map(
    prepareFacilities
  );

  // const MHFR_URL = `${process.env.MFL_API_URL}/api/Facilities`;
  // const MHFRFacilities = await request.get(MHFR_URL);
  // _.isEqual(array1.sort(), array2.sort()); compare two array

  console.log(preparedMediatorFacilities);
  const message = "Get Last synchronizations form database";
  OrchestrationRegister.add(req, message, "malu", 200);

  PropertiesRegister.add("client", clientId);
  PropertiesRegister.add("facilities", 4);

  res.set("Content-Type", "application/json+openhim");
  res.send(
    utils.buildReturnObject(
      urn,
      "Successful",
      200,
      {},
      JSON.stringify("malu"),
      OrchestrationRegister.orchestrations,
      PropertiesRegister.properties
    )
  );
};
