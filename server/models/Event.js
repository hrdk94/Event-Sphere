const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  venue: String,
  poster: String, // image URL
  category: String,

  participantLimit: Number,
  requiresApproval: { type: Boolean, default: false },

  status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending"
  },


  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
