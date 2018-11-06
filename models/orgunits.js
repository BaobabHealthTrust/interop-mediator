const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const organizationUnitsSchema = new Schema({
  DHAMISName: String,
  DHIS2Id: String
});

module.exports = mongoose.model("OrganizationUnits", organizationUnitsSchema);
