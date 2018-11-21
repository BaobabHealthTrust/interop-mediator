const express = require('express')

const router = express.Router()

const { synchronizations } = require('../controllers')
const { logger, validation, validateParamId } = require('../middleware')
const { synchronizationSchema } = require('../schema')

const {
  getSynchronizations,
  getSynchronization,
  addSynchronization
} = synchronizations

router.get('/', logger, getSynchronizations)
router.get('/:id', validateParamId, logger, getSynchronization)
router.post(
  '/',
  [logger, validation(synchronizationSchema)],
  addSynchronization
)

module.exports = router
