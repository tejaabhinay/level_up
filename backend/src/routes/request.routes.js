const express = require("express");
const {
  sendRequest,
  getIncomingRequests,
  updateRequestStatus,
} = require("../controllers/request.controller");

const router = express.Router();

router.post("/", sendRequest);
router.get("/incoming/:userId", getIncomingRequests);
router.patch("/:id", updateRequestStatus);

module.exports = router;
