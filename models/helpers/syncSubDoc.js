const { genericDate, genericString } = require('./syncTypes')

module.exports = {
  Name: genericString,
  CommonName: genericString,
  Code: genericString,
  OperationalStatus: genericString,
  RegulatoryStatus: genericString,
  DateOpened: genericDate,
  LastUpdated: genericDate,
  DHIS2Code: genericString,
  OpenLMISCode: genericString,
  District: genericString,
  Zone: genericString,
  isRecent: Boolean,
  isRemoved: Boolean
}
