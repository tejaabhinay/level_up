const TeamRequest = require("../models/TeamRequest");

// @desc    Send team-up request
// @route   POST /api/requests
const sendRequest = async (req, res) => {
  try {
    const { fromUser, toUser } = req.body;

    if (fromUser === toUser) {
      return res.status(400).json({ message: "Cannot request yourself" });
    }

    // prevent duplicate requests
    const existing = await TeamRequest.findOne({
      fromUser,
      toUser,
      status: "pending",
    });

    if (existing) {
      return res
        .status(409)
        .json({ message: "Request already sent" });
    }

    const request = await TeamRequest.create({
      fromUser,
      toUser,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get incoming requests for a user
// @route   GET /api/requests/incoming/:userId
const getIncomingRequests = async (req, res) => {
  try {
    const requests = await TeamRequest.find({
      toUser: req.params.userId,
      status: "pending",
    }).populate("fromUser", "name skills portfolio");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update request status
// @route   PATCH /api/requests/:id
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const request = await TeamRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  sendRequest,
  getIncomingRequests,
  updateRequestStatus,
};
