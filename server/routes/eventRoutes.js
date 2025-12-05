const express = require("express");
const Event = require("../models/Event");
const { auth, requireRole } = require("../middleware/auth");
const router = express.Router();

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
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).send("Error fetching events");
  }
});

module.exports = router;
