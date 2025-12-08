const express = require("express");
const jwt = require("jsonwebtoken");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

/**
 * POST /api/attendance/scan
 * Body: { qrToken: "..." }
 * Scans QR and marks attendance
 */
router.post("/attendance/scan", auth, requireRole("club"), async (req, res) => {
  try {
    const { qrToken } = req.body;

    if (!qrToken)
      return res.status(400).json({ message: "QR token missing" });

    // Verify QR token
    let decoded;
    try {
      decoded = jwt.verify(qrToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired QR token" });
    }

    const { regId, eventId, userId } = decoded;

    // Find registration
    const registration = await Registration.findById(regId)
      .populate("eventId", "title createdBy")
      .populate("userId", "name email");

    if (!registration)
      return res.status(404).json({ message: "Registration not found" });

    // Ensure QR belongs to correct event
    if (registration.eventId._id.toString() !== eventId)
      return res.status(400).json({ message: "QR does not match this event" });

    // Ensure the user matches
    if (registration.userId._id.toString() !== userId)
      return res.status(400).json({ message: "QR does not match this student" });

    // Check if club owns the event
    const clubId = req.user.id;
    if (registration.eventId.createdBy.toString() !== clubId)
      return res.status(403).json({ message: "You do not own this event" });

    // Check if already attended
    if (registration.attended)
      return res.status(400).json({ message: "Attendance already marked" });

    // Mark attendance
    registration.attended = true;
    await registration.save();

    res.json({
      message: "Attendance marked successfully",
      student: registration.userId.name,
      email: registration.userId.email,
      event: registration.eventId.title,
      time: registration.updatedAt,
    });

  } catch (err) {
    console.error("Attendance Scan Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
