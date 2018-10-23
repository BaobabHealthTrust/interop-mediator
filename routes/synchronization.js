const express = require("express");
const router = express.Router();

const { synchronizations } = require("../controllers");

const {
  getSynchronizations,
  getSynchronization,
  addSynchronization
} = synchronizations;

router.get("/", getSynchronizations);
router.get("/:id", getSynchronization);
router.post("/", addSynchronization);

module.exports = router;
