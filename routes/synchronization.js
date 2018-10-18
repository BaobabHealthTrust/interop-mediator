const express = require("express");
const router = express.Router();

const { synchronizations } = require("../controllers");

const { get } = synchronizations;

router.get("/", get);

module.exports = router;
