const express = require("express");
const router = express.Router();

const { migrations } = require("../controllers");

router.all("*", migrations);

module.exports = router;
