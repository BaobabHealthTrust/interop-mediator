const fs = require("fs");
const parse = require("csv-parse");
const mongoose = require("mongoose");

require("dotenv").config({ path: ".env" });

require("../helpers").configureLogger();

const parseOptions = { delimiter: "," };

const populate = async () => {

  const {
    buildFilePath,
    handleOrgUnitsParse,
    handleArtDataElementsParse
  } = require("./helpers");

  const { database } = require("config");

  await mongoose.connect(
    database,
    { useNewUrlParser: true },
    (err) => console.log(err || `connected to mongodb ${database} \n`)
  );

  let fileName = process.env.ORGUNITS_FILE_NAME || "orgunits";
  const orgunitsFile = buildFilePath(fileName);
  const orgUnitsParser = parse(parseOptions, handleOrgUnitsParse);
  await fs.createReadStream(orgunitsFile).pipe(orgUnitsParser);

  fileName = process.env.ART_DATA_ELEMENTS_FILE_NAME || "artdataelements";
  const artDataElementsFile = buildFilePath(fileName);
  const artDataElementsParser = parse(parseOptions, handleArtDataElementsParse);
  await fs.createReadStream(artDataElementsFile).pipe(artDataElementsParser);

}

populate()
