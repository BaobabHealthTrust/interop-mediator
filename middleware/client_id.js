const { error } = require("winston");

module.exports = (req, res, next) => {
  const client = req.get("x-openhim-clientid") || req.get("x-client")

  if (!client) {
    error("OpenHIM client ID is required.");
    return res.status(400).send({ error: "OpenHIM client ID is required." });
  }

  req.client = client;
  next();
};
