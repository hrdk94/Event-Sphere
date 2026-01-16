const express = require("express");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { auth } = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/stats/events/:eventId
 * Club (owner) or Admin can view event stats
 */
router.get("/events/:eventId", auth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const user = req.user;

    // Fetch event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Permission check
    const isAdmin = user.role === "admin";
    const isOwner =
      event.createdBy &&
      event.createdBy.toString() === (user.id || user._id?.toString());

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Count registrations
    const total = await Registration.countDocuments({ eventId });
    const approved = await Registration.countDocuments({
      eventId,
      status: "approved",
    });
    const pending = await Registration.countDocuments({
      eventId,
      status: "pending",
    });
    const rejected = await Registration.countDocuments({
      eventId,
      status: "rejected",
    });
    const attended = await Registration.countDocuments({
      eventId,
      attended: true,
    });

    // Remaining capacity
    let remaining = "Unlimited";
    if (event.participantLimit) {
      remaining = Math.max(event.participantLimit - approved, 0);
    }

    // Response
    res.json({
      eventId,
      stats: {
        total,
        approved,
        pending,
        rejected,
        attended,
        remaining,
      },
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
