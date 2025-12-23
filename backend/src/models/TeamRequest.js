const mongoose = require("mongoose");

const teamRequestSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    token: {
  type: String,
  required: true,
  unique: true,
},

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TeamRequest", teamRequestSchema);
