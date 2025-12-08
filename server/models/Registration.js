const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // default behavior — will be set based on event.requiresApproval
    },
    attended: { type: Boolean, default: false },
    qrCodeData: { type: String, default: null }, // reserved for later QR token
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);
