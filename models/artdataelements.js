const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const string = { type: String }

const artDataElementsSchema = new Schema({
  DataElement: string,
  Name: string,
  Code: string,
  CategoryName: string,
  DataElementID: string,
  CategoryID: string,
  AttributeID: string
});

module.exports = mongoose.model("ArtDataElements", artDataElementsSchema);
