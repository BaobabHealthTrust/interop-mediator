const express = require('express')

const router = express.Router()

const { getOpenLMISMigrations, addOpenLMISMigrations } = require('../controllers').migrations
const { logger, validation } = require('../middleware')

const { migrationSchema } = require('../schema')

router.get('/openlmis', logger, getOpenLMISMigrations)
router.post('/openlmis', logger, validation(migrationSchema), addOpenLMISMigrations)

module.exports = router
