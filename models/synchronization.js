const mongoose = require('mongoose')

const Schema = mongoose.Schema

const {
  syncSubDoc: facilities,
  types
} = require('./helpers')

const {
  Number,
  Date,
  String
} = types

const synchronizationSchema = new Schema({
  totalFacilitiesAdded: Number,
  totalFacilitiesRemoved: Number,
  totalFacilitiesUpdated: Number,
  synchronizationDate: Date,
  clientId: String,
  isSuccessful: Boolean,
  facilities: [facilities]
})

module.exports = mongoose.model('Synchronization', synchronizationSchema)
