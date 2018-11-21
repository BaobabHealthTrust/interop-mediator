const express = require('express')
const router = express.Router()

const { changedFacilitiesController } = require('../controllers')

router.get('/', changedFacilitiesController)

module.exports = router
