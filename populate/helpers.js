const { join } = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

module.exports.buildFilePath = (filename = null) => {
  const path = join(__dirname, "..", "data", `${filename}.csv`);

  if (!fs.existsSync(path)) {
    console.log(`File ${path} was not found.`);
    process.exit(1);
  }

  return path;
};

const connect = async () => {
  const { database } = require("config");

  await mongoose.connect(
    database,
    { useNewUrlParser: true },
    (err) => console.log(err || `connected to mongodb ${database} \n`)
  );
}

module.exports.handleOrgUnitsParse = async (err, data) => {
  const { OrganizationUnits } = require('../models')
  const orgUnits = []

  await console.log("Mapping organization units");

  for (let row of data) {
    const [name, id] = row;
    orgUnits.push({ DHAMISName: name, DHIS2Id: id })
  }

  await OrganizationUnits.collection.insertMany(orgUnits);
  await console.log("Organization units mapped succefully");
};

module.exports.handleArtDataElementsParse = async (err, data) => {
  const { ArtDataElements } = require('../models')
  const artDataElements = []

  await console.log("adding art data elements");

  for (let row of data) {
    const [
      dataElementName,
      code,
      categoryName,
      dataElementID,
      categoryID,
      attributeID
    ] = row;

    artDataElements.push({
      DataElement: dataElementName,
      Code: code,
      CategoryName: categoryName,
      DataElementID: dataElementID,
      CategoryID: categoryID,
      AttributeID: attributeID
    })
  }

  await ArtDataElements.collection.insertMany(artDataElements);
  await console.log("ART data elements added successfully");
};
