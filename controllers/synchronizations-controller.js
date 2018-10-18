const { info, error } = require("winston");
const utils = require("../lib/utils");
const { urn } = require("../config/mediator.json");

module.exports.get = async (req, res) => {
  info(`Processing ${req.method} request on ${req.url}`);
  var responseBody = { message: "put your data here" };

  let orchestrations = [];

  orchestrations.push({
    name: "Get Synchronizations",
    request: {
      path: req.path,
      headers: req.headers,
      querystring: req.originalUrl.replace(req.path, ""),
      body: JSON.stringify(req.body),
      method: req.method,
      timestamp: new Date().getTime()
    },
    response: {
      status: 200,
      body: JSON.stringify(responseBody),
      timestamp: new Date().getTime()
    }
  });

  res.set("Content-Type", "application/json+openhim");

  const properties = { name: "Malu M. mzota" };

  const r = utils.buildReturnObject(
    urn,
    "Successful",
    200,
    {},
    JSON.stringify(responseBody),
    orchestrations,
    properties
  );

  res.send(r);
};
