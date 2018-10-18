const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const genericStringType = { type: String, required: true };
const genericNumberType = { type: Number, required: true };
const genericDateType = { type: Date, default: Date.now };

const customGenericStringType = {
  type: { type: String, default: "String" },
  previousValue: String,
  newValue: String
};

const customGenericDateType = {
  type: { type: String, default: "Date" },
  previousValue: Date,
  newValue: Date
};

const synchronizationFacilitiesFields = {
  name: customGenericStringType,
  CommonName: customGenericStringType,
  Code: customGenericStringType,
  OperationalStatus: customGenericStringType,
  RegulatoryStatus: customGenericStringType,
  DateOpened: customGenericDateType,
  LastUpdated: customGenericDateType,
  DHIS2Code: customGenericStringType,
  OpenLMISCode: customGenericStringType,
  District: customGenericStringType,
  Zone: customGenericStringType,
  isCreated: Boolean,
  isRemoved: Boolean
};

const synchronizationSchema = new Schema({
  totalFacilitiesAdded: genericNumberType,
  totalFacilitiesRemoved: genericNumberType,
  totalFacilitiesUpdated: genericNumberType,
  synchronizationDate: genericDateType,
  clientId: genericStringType,
  isSuccessful: Boolean,
  facilities: [synchronizationFacilitiesFields]
});

module.exports = mongoose.model("Synchronization", synchronizationSchema);
