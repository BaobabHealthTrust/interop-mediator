const _ = require("lodash");
const { info, error } = require("winston");
const Joi = require("joi");
const request = require("axios");

const utils = require("../lib/utils");
const { urn } = require("../config/mediator.json");
const OrchestrationRegister = require("../lib/OrchestrationRegister");
const PropertiesRegister = require("../lib/PropertiesRegister");
const { Synchronization: Sync } = require("../models");

const prepareLastSyncFacilities = facility => ({
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
});

const prepareMHFRFacility = facility => {
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
    operationalStatus = null
  } = facility;

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
    isNew: false,
    isRemoved: false
  };

  return formattedFacility;
};

const buildReturnFacility = (f, fac) => {
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
    isNew: false,
    isRemoved: false
  };

  return formattedFacility;
};

const queryBuilder = (
  startDate = new Date("01.01.1970"),
  endDate = new Date()
) => {
  const query = {
    where: {
      updated_at: { gte: startDate, lte: endDate },
      archived_date: null
    },
    include: ["regulatoryStatus", "operationalStatus", { district: "zone" }]
  };
  return JSON.stringify(query);
};

const queryMHFRFacilities = async (query = null) => {
  if (!query) query = queryBuilder();
  const MHFR_URL = `${process.env.MFL_API_URL}/api/Facilities?filter=${query}`;
  const response = await request.get(MHFR_URL);
  const { data: facilities = [] } = response;
  return facilities;
};

module.exports = async (req, res) => {
  info(`Processing ${req.method} request on ${req.url}`);
  const clientId = req.client;
  let response = {};
  // get last sync
  const sync = await Sync.findOne({ clientId }).sort({
    synchronizationDate: -1
  });

  if (!sync) {
    const facilities = await queryMHFRFacilities();
    const data = facilities.map(facility => prepareMHFRFacility(facility));
    response = data;
  } else {
    const { synchronizationDate: startDate, facilities } = sync;
    const query = queryBuilder(startDate);
    const qmf = await queryMHFRFacilities(query);
    const pqmf = qmf.map(facility => prepareMHFRFacility(facility));

    const data = pqmf.map(f => {
      const fac = facilities.find(e => f.Code.newValue == e.Code.newValue);
      return buildReturnFacility(f, fac);
    });

    response = data;
  }
  // const query = queryBuilder(startDate, endDate);
  // const f = await queryMHFRFacilities();

  // console.log(f);

  // const mf = lsf.map(prepareLastSyncFacilities);

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
