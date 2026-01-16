const express = require("express");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const {auth, requireRole} = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/club/events/:eventId/registrations
 * Club views registrations for their event
 */
router.get(
  "/events/:eventId/registrations",
  auth,
  requireRole("club"),
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const clubId = req.user.id;

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      if (event.createdBy.toString() !== clubId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const registrations = await Registration.find({ eventId })
        .populate("userId", "name email department year")
        .sort({ createdAt: -1 });

      res.json({
        count: registrations.length,
        registrations,
      });
    } catch (err) {
      console.error("Club get registrations error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * PATCH /api/club/registrations/:registrationId/approve
 */
router.patch(
  "/registrations/:registrationId/approve",
  auth,
  requireRole("club"),
  async (req, res) => {
    try {
      const { registrationId } = req.params;
      const clubId = req.user.id;

      const registration = await Registration.findById(registrationId);
      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }

      if (registration.status === "approved") {
        return res.json({ message: "Already approved" });
      }

      const event = await Event.findById(registration.eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      if (event.createdBy.toString() !== clubId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Capacity check
      if (event.participantLimit) {
        const approvedCount = await Registration.countDocuments({
          eventId: event._id,
          status: "approved",
        });

        if (approvedCount >= event.participantLimit) {
          return res.status(400).json({ message: "Event is full" });
        }
      }

      registration.status = "approved";
      await registration.save();

      res.json({
        message: "Registration approved",
        registration,
      });
    } catch (err) {
      console.error("Approve registration error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * PATCH /api/club/registrations/:registrationId/reject
 */
router.patch(
  "/registrations/:registrationId/reject",
  auth,
  requireRole("club"),
  async (req, res) => {
    try {
      const { registrationId } = req.params;
      const clubId = req.user.id;

      const registration = await Registration.findById(registrationId);
      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }

      if (registration.status === "rejected") {
        return res.json({ message: "Already rejected" });
      }

      const event = await Event.findById(registration.eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      if (event.createdBy.toString() !== clubId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      registration.status = "rejected";
      await registration.save();

      res.json({
        message: "Registration rejected",
        registration,
      });
    } catch (err) {
      console.error("Reject registration error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * PATCH /api/club/events/:eventId/cancel
 * Club (owner) or Admin cancels an event
 */
router.patch("/events/:eventId/cancel", auth, async (req, res) => {
    try {
      const { eventId } = req.params;
      const user = req.user;

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      const isAdmin = user.role === "admin";
      const isOwner =
        event.createdBy &&
        event.createdBy.toString() === (user.id || user._id?.toString());

      if (!isAdmin && !isOwner) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (event.isCancelled) {
        return res.json({ message: "Event already cancelled" });
      }

      event.isCancelled = true;
      await event.save();

      res.json({
        message: "Event cancelled successfully",
        eventId: event._id,
      });
    } catch (err) {
      console.error("Cancel event error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


module.exports = router;