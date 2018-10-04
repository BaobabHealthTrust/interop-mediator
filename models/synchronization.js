const mongoose = require('mongoose')

const Schema = mongoose.Schema
mongoose.Promise = global.Promise

const synchronizationSchema = new Schema({
  totalFacilitiesAdded: {
    type: Number,
    required: 'Please provide total facilities added'
  },
  totalFacilitiesRemoved: {
    type: Number,
    required: 'Please provide total facilities removed'
  },
  totalFacilitiesUpdated: {
    type: Number,
    required: 'Please provide total facilities updated'
  },
  synchronizationDate: {
    type: Date,
    default: Date.now
  },
  clientId: String
})

module.exports = mongoose.model('Synchronization', synchronizationSchema)
