// @desc    Send team-up request
// @route   POST /api/requests
const TeamRequest = require("../models/TeamRequest");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");
const { v4: uuidv4 } = require("uuid");

// @desc    Send team-up request (with email notification)
// @route   POST /api/requests
const sendRequest = async (req, res) => {
  try {
    const { fromUser, toUser } = req.body;

    if (fromUser === toUser) {
      return res.status(400).json({ message: "Cannot request yourself" });
    }

    const existing = await TeamRequest.findOne({
      fromUser,
      toUser,
      status: "pending",
    });

    if (existing) {
      return res.status(409).json({ message: "Request already sent" });
    }

    const token = uuidv4();

    const request = await TeamRequest.create({
      fromUser,
      toUser,
      token,
    });

    const sender = await User.findById(fromUser);
    const receiver = await User.findById(toUser);

    const link = `${process.env.FRONTEND_URL}/request/${token}`;

    await sendEmail({
      to: receiver.email,
      subject: "Someone wants to team up with you 🚀",
      html: `
        <p>Hi ${receiver.name},</p>
        <p><strong>${sender.name}</strong> wants to collaborate with you.</p>
        <p>
          👉 <a href="${link}">View request</a>
        </p>
        <p>This link is secure and private.</p>
      `,
    });

    res.status(201).json({ message: "Request sent & email delivered" });
  } catch (error) {
    console.error("Request error:", error);
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
