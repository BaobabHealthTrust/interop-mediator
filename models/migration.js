const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { Number, Date, String } = require('./helpers').types

const migrationSchema = new Schema({
  successful_records: Number,
  failed_records: Number,
  period: String,
  migration_date: Date
})

module.exports = mongoose.model('Migration', migrationSchema)
