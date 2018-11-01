
const { error } = require("winston");

module.exports = (req, res, next) => {
  let client =  req.get("x-client")

  if (!client) {
    client = "mhfr";
    //error("OpenHIM client ID is required.");
    //return res.status(400).send({ error: "OpenHIM client ID is required." });
  }

  req.client = client;
  next();
};
