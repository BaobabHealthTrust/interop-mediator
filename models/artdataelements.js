const mongoose = require('mongoose')

const Schema = mongoose.Schema
const { String } = require('./helpers').types

const artDataElementsSchema = new Schema({
  DataElement: String,
  Name: String,
  Code: String,
  CategoryName: String,
  DataElementID: String,
  CategoryID: String,
  AttributeID: String
})

module.exports = mongoose.model('ArtDataElements', artDataElementsSchema)
