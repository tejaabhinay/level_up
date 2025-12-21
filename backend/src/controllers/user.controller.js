const User = require("../models/user");

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, skills, lookingFor, portfolio } = req.body;

    // Basic validation
    if (!name || !email || !skills || !lookingFor) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already registered",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      skills,
      lookingFor,
      portfolio,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = { registerUser };
