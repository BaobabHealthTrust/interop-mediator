const express = require('express')
const router = express.Router()

const { synchronization } = require('../controllers')
const { getSynchronizations } = synchronization

router.get('/synchronizations', getSynchronizations)

module.exports = router
