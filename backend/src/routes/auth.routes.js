const express = require("express");
const { login } = require("../controllers/auth.controller");

const router = express.Router();
console.log("JWT SECRET:", process.env.JWT_SECRET);

router.post("/login", login);

module.exports = router;
