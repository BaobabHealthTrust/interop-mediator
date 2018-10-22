const _ = require("lodash");
const { info, error } = require("winston");
const Joi = require("joi");
const request = require("axios");

const utils = require("../lib/utils");
const { urn } = require("../config/mediator.json");
const OrchestrationRegister = require("../lib/OrchestrationRegister");
const PropertiesRegister = require("../lib/PropertiesRegister");
const { Synchronization } = require("../models");

module.exports = async (req, res) => {
  info(`Processing ${req.method} request on ${req.url}`);
  const clientId = req.client;

  // get last sync
  const {
    facilities: lastSynchronizationFacilities
  } = await Synchronization.findOne({ clientId }).sort({
    synchronizationDate: -1
  });

  const prepareFacilities = facility => {
    return {
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
    };
  };

  const mf = lastSynchronizationFacilities.map(prepareFacilities);

  const query = JSON.stringify({
    include: ["regulatoryStatus", "operationalStatus", { district: "zone" }],
    limit: 1
  });

  const MHFR_URL = `${process.env.MFL_API_URL}/api/Facilities?filter=${query}`;
  const { data: facilities } = await request.get(MHFR_URL);
  // _.isEqual(array1.sort(), array2.sort()); compare two array

  const pyo = facility => {
    const {
      facility_code: Code = null,
      facility_code_dhis2: DHIS2Code = null,
      facility_code_openlmis: OpenLMISCode = null,
      registration_number,
      facility_name: Name = null,
      common_name: commonName,
      facility_date_opened: DateOpened = null,
      updated_at: LastUpdated = null,
      district = null,
      regulatoryStatus = null,
      operationalStatus = null
    } = facility;

    const { district_name: District = null, zone } = district;
    const Zone = zone.zone_name;

    const {
      facility_regulatory_status: RegulatoryStatus = null
    } = regulatoryStatus;

    const {
      facility_operational_status: OperationalStatus = null
    } = operationalStatus;

    zone_name: return {
      Name,
      commonName,
      Code,
      OperationalStatus,
      RegulatoryStatus,
      DateOpened,
      LastUpdated,
      DHIS2Code,
      OpenLMISCode,
      District,
      Zone
    };
  };

  const qf = facilities.map(pyo);
  console.log(mf, qf);

  const message = "Get Last synchronizations form database";
  OrchestrationRegister.add(req, message, "malu", 200);

  PropertiesRegister.add("client", clientId);
  PropertiesRegister.add("facilities", 4);

  res.set("Content-Type", "application/json+openhim");
  res.send(
    utils.buildReturnObject(
      urn,
      "Successful",
      200,
      {},
      JSON.stringify("malu"),
      OrchestrationRegister.orchestrations,
      PropertiesRegister.properties
    )
  );
};
