const { Migration } = require('../models')
const utils = require('../lib/utils')
const { urn } = require('../config/mediator.json')
const OrchestrationRegister = require('../lib/OrchestrationRegister')
const PropertiesRegister = require('../lib/PropertiesRegister')
const { engine } = require('../helpers')

module.exports.getOpenLMISMigrations = async (req, res) => {
  const clientId = req.client

  const migrations = await Migration.find({}).sort({ 'migration_date': 'desc' })
  const OrchestrationMessage = 'Get migrations form the mediator database'
  OrchestrationRegister.add(req, OrchestrationMessage, migrations, 200)

  PropertiesRegister.add('Client', clientId)
  PropertiesRegister.add('Migrations', migrations.length)

  res.set('Content-Type', 'application/json+openhim')

  const orchestrations = OrchestrationRegister.orchestrations
  OrchestrationRegister.orchestrations = []

  const properties = PropertiesRegister.properties
  PropertiesRegister.properties = {}

  return res.send(
    utils.buildReturnObject(
      urn,
      'Successful',
      200,
      {},
      JSON.stringify(migrations),
      orchestrations,
      properties,
      req
    )
  )
}

module.exports.addOpenLMISMigrations = async (req, res) => {
  const clientId = req.client
  const { quarter, year } = req.body

  const successfulRecords = 0
  const failedRecords = 0

  const props = {
    period: `Q${quarter} ${year}`,
    successful_records: successfulRecords,
    failed_records: failedRecords
  }

  const migration = new Migration(props)
  console.log(migration)

  engine(quarter, year, migration._id)

  await migration.save()

  const orchMessage = 'Added a migration in the database'
  OrchestrationRegister.add(req, orchMessage, migration, 200)

  const { migration_date: date } = migration

  PropertiesRegister.add('client', clientId)
  PropertiesRegister.add('Successful records', successfulRecords)
  PropertiesRegister.add('Failed records', failedRecords)
  PropertiesRegister.add('Period', req.body.period)
  PropertiesRegister.add('Migration date', date)

  const orchestrations = OrchestrationRegister.orchestrations
  OrchestrationRegister.orchestrations = []

  const properties = PropertiesRegister.properties
  PropertiesRegister.properties = {}

  res.set('Content-Type', 'application/json+openhim')
  return res.send(
    utils.buildReturnObject(
      urn,
      'Successful',
      200,
      {},
      JSON.stringify(migration),
      orchestrations,
      properties,
      req
    )
  )
}
