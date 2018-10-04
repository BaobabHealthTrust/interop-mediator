const express = require('express')
const router = express.Router()

const { migration } = require('../controllers')

router.all('*', migration)

module.exports = router
