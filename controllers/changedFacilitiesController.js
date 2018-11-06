const _ = require("lodash");
const { info, error } = require("winston");
const Joi = require("joi");

const utils = require("../lib/utils");
const { urn } = require("../config/mediator.json");
const OrchestrationRegister = require("../lib/OrchestrationRegister");
const PropertiesRegister = require("../lib/PropertiesRegister");
const { Synchronization: Sync } = require("../models");
const { changedFacilities } = require("../helpers");

module.exports = async (req, res) => {
  const clientId = req.client;
  const {
    queryBuilder,
    queryMHFRFacilities,
    prepareMHFRFacility,
    buildReturnFacility,
    prepareLastSyncFacilities
  } = changedFacilities;

  let response = {};
  // get last sync
  const sync = await Sync.findOne({ clientId }).sort({
    synchronizationDate: -1
  });

  if (!sync) {
    const MHFRFacilities = await queryMHFRFacilities();
    response = MHFRFacilities.map(prepareMHFRFacility);
    response = response.filter(facility => facility !== null);
  } else {
    const { synchronizationDate: startDate, facilities } = sync;
    const query = queryBuilder(startDate);
    const MHFRFacilities = await queryMHFRFacilities(query);
    response = MHFRFacilities.map(prepareMHFRFacility);
    response = response.filter(facility => facility !== null);

    const responseDataArray = [];

    for (let res of response) {
      const oldMediatorFacilities = await Sync.findOne({
        "facilities.Code.newValue": res.Code.newValue
      }).sort({ synchronizationDate: -1 });

      if (oldMediatorFacilities) {
        const { facilities: oldFacilities } = oldMediatorFacilities;
        const oldFacility = oldFacilities.find(
          e => res.Code.newValue == e.Code.newValue
        );

        let responseData;
        if (oldFacility) {
          responseData = buildReturnFacility(res, oldFacility);
        } else {
          responseData = prepareLastSyncFacilities(res);
          responseData = buildReturnFacility(res,oldFacility)
        }
        responseDataArray.push(responseData);
      } else {
        let responseData = res;
        responseData.isRecent = true;
        responseDataArray.push(responseData);
      }
    }

    response = responseDataArray;
  }

 // return res.send(response)

  const message = "Get Last synchronizations form database";
  OrchestrationRegister.add(req, message, response, 200);

  PropertiesRegister.add("client", clientId);
  PropertiesRegister.add("facilities", 4);

  res.set("Content-Type", "application/json+openhim");
  res.send(
    utils.buildReturnObject(
      urn,
      "Successful",
      200,
      {},
      JSON.stringify(response),
      OrchestrationRegister.orchestrations,
      PropertiesRegister.properties
    )
  );
};
