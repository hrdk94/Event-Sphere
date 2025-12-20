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

//single event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching event" });
  }
});


module.exports = router;
