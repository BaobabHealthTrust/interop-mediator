const request = require("axios");
const { info, error } = require("winston");

module.exports.prepareLastSyncFacilities = facility => ({
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
  isRecent: facility.isRecent,
  isRemoved: facility.isRemoved
});

module.exports.prepareMHFRFacility = (facility = null) => {
  if (!facility) return null;
  const {
    facility_code: Code = null,
    facility_code_dhis2: DHIS2Code = null,
    facility_code_openlmis: OpenLMISCode = null,
    registration_number,
    facility_name: Name = null,
    common_name: commonName,
    facility_date_opened: DateOpened = null,
    updated_at: LastUpdated = null,
    regulatoryStatus = null,
    operationalStatus = null,
    district = null
  } = facility;

  const District = district.district_name;
  const Zone = district.zone.zone_name;
  const {
    facility_regulatory_status: RegulatoryStatus = null
  } = regulatoryStatus;

  const {
    facility_operational_status: OperationalStatus = null
  } = operationalStatus;

  const formattedFacility = {
    Name: { previousValue: null, newValue: Name },
    CommonName: { previousValue: null, newValue: commonName },
    Code: { previousValue: null, newValue: Code },
    OperationalStatus: { previousValue: null, newValue: OperationalStatus },
    RegulatoryStatus: { previousValue: null, newValue: RegulatoryStatus },
    DateOpened: { previousValue: null, newValue: DateOpened },
    LastUpdated: { previousValue: null, newValue: LastUpdated },
    DHIS2Code: { previousValue: null, newValue: DHIS2Code },
    OpenLMISCode: { previousValue: null, newValue: OpenLMISCode },
    District: { previousValue: null, newValue: District },
    Zone: { previousValue: null, newValue: Zone },
    isRecent: false,
    isRemoved: false
  };

  return formattedFacility;
};

module.exports.buildReturnFacility = (f, fac) => {
  const formattedFacility = {
    Name: { previousValue: fac.Name.newValue, newValue: f.Name.newValue },
    CommonName: {
      previousValue: fac.CommonName.newValue,
      newValue: f.CommonName.newValue
    },
    Code: {
      previousValue: fac.Code.newValue,
      newValue: f.Code.newValue
    },
    OperationalStatus: {
      previousValue: fac.OperationalStatus.newValue,
      newValue: f.OperationalStatus.newValue
    },
    RegulatoryStatus: {
      previousValue: fac.RegulatoryStatus.newValue,
      newValue: f.RegulatoryStatus.newValue
    },
    DateOpened: {
      previousValue: fac.DateOpened.newValue,
      newValue: f.DateOpened.newValue
    },
    LastUpdated: {
      previousValue: fac.LastUpdated.newValue,
      newValue: f.LastUpdated.newValue
    },
    DHIS2Code: {
      previousValue: fac.DHIS2Code.newValue,
      newValue: f.DHIS2Code.newValue
    },
    OpenLMISCode: {
      previousValue: fac.OpenLMISCode.newValue,
      newValue: f.OpenLMISCode.newValue
    },
    District: { previousValue: fac.District.newValue, newValue: f.District.newValue },
    Zone: { previousValue: fac.Zone.newValue, newValue: f.Zone.newValue },
    isRecent: false,
    isRemoved: false
  };
  return formattedFacility;
};

const queryBuilder = (startDate = new Date("01.01.1970")) => {
  const query = {
    where: {
      updated_at: { gte: startDate, lte: new Date() },
      facility_code_dhis2: { neq: null },
      archived_date: null
    },
    include: ["regulatoryStatus", "operationalStatus", { district: "zone" }]
  };
  return JSON.stringify(query);
};

module.exports.queryBuilder = queryBuilder;

module.exports.queryMHFRFacilities = async (query = null) => {
  if (!query) query = queryBuilder();
  const MHFR_URL = `${process.env.MFL_API_URL}/api/Facilities?filter=${query}`;
console.log(MHFR_URL)
  const response = await request.get(MHFR_URL).catch(err => error(err));
  const { data: facilities = [] } = response;
  return facilities;
};
