const { info, error } = require("winston");
const utils = require("../lib/utils");
const { urn } = require("../config/mediator.json");
const OrchestrationRegister = require("../lib/OrchestrationRegister");
const PropertiesRegister = require("../lib/PropertiesRegister");

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
