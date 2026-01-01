const TeamRequest = require("../models/TeamRequest");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const Conversation = require("../models/Conversation");

// @desc    Send team-up request (Modified to use Socket Notifications)
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
    const request = await TeamRequest.create({ fromUser, toUser, token });

    const sender = await User.findById(fromUser);
    const receiver = await User.findById(toUser);

    // Get Socket info from the app instance
    const io = req.app.get("io");
    const userSockets = req.app.get("userSockets");
    const receiverSocketId = userSockets.get(toUser.toString());

    const notificationData = {
      title: "New Team Request! 🚀",
      body: `${sender.name} wants to collaborate with you.`,
      url: `/request/${token}`
    };

    // If user is online, emit notification immediately
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new_notification", notificationData);
    }

    res.status(201).json({ message: "Request sent & notification pushed" });
  } catch (error) {
    console.error("Request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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

const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const request = await TeamRequest.findById(req.params.id);
    if (!request || request.status !== "pending") {
      return res.status(400).json({ message: "Request not found or already handled" });
    }

    request.status = status;
    await request.save();

    if (status === "accepted") {
      const existingConversation = await Conversation.findOne({ request: request._id });
      if (!existingConversation) {
        await Conversation.create({
          participants: [request.fromUser, request.toUser],
          request: request._id,
        });
      }
    }
    res.json({ message: `Request ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getRequestByToken = async (req, res) => {
  try {
    const request = await TeamRequest.findOne({ token: req.params.token })
      .populate("fromUser", "name skills portfolio")
      .populate("toUser", "email name");
    if (!request || request.status !== "pending") {
      return res.status(404).json({ message: "Invalid or expired request" });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  sendRequest,
  getIncomingRequests,
  updateRequestStatus,
  getRequestByToken,
};