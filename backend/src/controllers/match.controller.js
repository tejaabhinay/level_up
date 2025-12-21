const User = require("../models/user");

// @desc    Get compatible matches for a user
// @route   GET /api/match/:userId
// @access  Public
const getMatches = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find current user
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Find users whose skills match currentUser's lookingFor
    const matches = await User.find({
      _id: { $ne: userId },
      skills: { $in: currentUser.lookingFor },
    }).select("-__v");

    res.json(matches);
  } catch (error) {
    console.error("Match error:", error.message);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = { getMatches };
