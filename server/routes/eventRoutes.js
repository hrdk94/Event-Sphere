const express = require("express");
const Event = require("../models/Event");
const { auth, requireRole } = require("../middleware/auth");
const Registration = require("../models/Registration");
const router = express.Router();
const getEventStatus = require("../utils/eventStatus");

// CREATE event (club only)
router.post("/create", auth, requireRole("club"), async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json(event);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating event");
  }
});

// GET all events (public)
// GET approved events only (for students)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" })
      .sort({ date: 1 });

    const eventsWithStatus = events.map(event => ({
      ...event.toObject(),
      timeStatus: getEventStatus(event.date),
    }));

    res.json(eventsWithStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching events" });
  }
});


//single event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      ...event.toObject(),
      timeStatus: getEventStatus(event.date),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching event" });
  }
});

// //register route updated
// router.post("/:id/register", auth, requireRole("student"), async (req, res) => {
//   try {
//     const eventId = req.params.id;

//     // no duplicate registration
//     const existing = await Registration.findOne({
//       userId: req.user.id,
//       eventId: eventId
//     });

//     if (existing) {
//       return res.status(400).json({ message: "Already registered" });
//     }

//     const registration = await Registration.create({
//       eventId: eventId,
//       userId: req.user.id
//     });

//     res.status(201).json({
//       message: "Registered successfully",
//       registrationId: registration._id
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Registration failed" });
//   }
// });

// ADMIN: Get all events
router.get("/admin/all", auth, requireRole("admin"), async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// ADMIN: Approve event
router.patch("/admin/:eventId/approve", auth, requireRole("admin"), async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.status = "approved";
    await event.save();

    res.json({ message: "Event approved", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to approve event" });
  }
});

// ADMIN: Reject event
router.patch("/admin/:eventId/reject", auth, requireRole("admin"), async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.status = "rejected";
    await event.save();

    res.json({ message: "Event rejected", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reject event" });
  }
});

// CLUB: Get events created by this club
router.get("/club/mine", auth, requireRole("club"), async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch club events" });
  }
});



module.exports = router;
