const express = require("express");
const router = express.Router();

const { synchronizations } = require("../controllers");
const { logger, validation } = require('../middleware')
const { synchronizationSchema } = require('../schema')

const {
  getSynchronizations,
  getSynchronization,
  addSynchronization
} = synchronizations;

const { idSchema, addSchema } = synchronizationSchema

router.get("/", logger, getSynchronizations);
router.get("/:id", logger, getSynchronization);
router.post("/",[logger, va] , addSynchronization);

module.exports = router;
