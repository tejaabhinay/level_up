const express = require("express");
const { getMatches } = require("../controllers/match.controller");

const router = express.Router();

router.get("/:userId", getMatches);

module.exports = router;
