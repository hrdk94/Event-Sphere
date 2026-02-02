const express = require("express");
const Registration = require("../models/Registration");
const { auth, requireRole } = require("../middleware/auth");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

const router = express.Router();

// STUDENT ANALYTICS
router.get("/student", auth, requireRole("student"), async (req, res) => {
  try {
    const userId = req.user.id;

    const totalRegistrations = await Registration.countDocuments({ userId });

    const attended = await Registration.countDocuments({
      userId,
      attended: true,
    });

    const certificatesEligible = await Registration.countDocuments({
      userId,
      attended: true,
    });

    res.json({
      totalRegistrations,
      attended,
      certificatesEligible,
    });
  } catch (err) {
    console.error("Student analytics error:", err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

// CLUB ANALYTICS
router.get("/club", auth, requireRole("club"), async (req, res) => {
  try {
    const clubId = req.user.id;

    // 1. All events created by this club
    const events = await Event.find({ createdBy: clubId }).select("_id");

    const eventIds = events.map((e) => e._id);

    // 2. Total events
    const totalEvents = eventIds.length;

    // 3. Total registrations across all events
    const totalRegistrations = await Registration.countDocuments({
      eventId: { $in: eventIds },
    });

    // 4. Total attendance marked
    const attended = await Registration.countDocuments({
      eventId: { $in: eventIds },
      attended: true,
    });

    res.json({
      totalEvents,
      totalRegistrations,
      attended,
    });
  } catch (err) {
    console.error("Club analytics error:", err);
    res.status(500).json({ message: "Failed to fetch club analytics" });
  }
});

// ADMIN ANALYTICS
router.get("/admin", auth, requireRole("admin"), async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();

    const pendingEvents = await Event.countDocuments({
      status: "pending",
    });

    const totalUsers = await User.countDocuments();

    const totalRegistrations = await Registration.countDocuments();

    res.json({
      totalEvents,
      pendingEvents,
      totalUsers,
      totalRegistrations,
    });
  } catch (err) {
    console.error("Admin analytics error:", err);
    res.status(500).json({ message: "Failed to fetch admin analytics" });
  }
});

module.exports = router;
