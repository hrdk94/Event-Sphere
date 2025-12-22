const express = require("express");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const qrcode = require("qrcode");

// Adjust this require to match your middleware filename
// If you used authMiddleware.js earlier: require("../middleware/authMiddleware")
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

/**
 * POST /api/events/:eventId/register
 * Student registers for an event -> create Registration
 */
router.post("/events/:eventId/register", auth, requireRole("student"), async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id || req.user._id; // support both middleware styles

    // 1) Check event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // 2) Prevent registration for past events
    if (new Date(event.date) < new Date())
      return res.status(400).json({ message: "Cannot register for past events" });

    // 3) Check already registered
    const already = await Registration.findOne({ eventId, userId });
    if (already) return res.status(400).json({ message: "You have already registered" });

    // 4) Check capacity (count approved + pending as per requirement; using approved/pending except rejected)
    if (event.participantLimit) {
      const count = await Registration.countDocuments({ eventId, status: { $ne: "rejected" } });
      if (count >= event.participantLimit)
        return res.status(400).json({ message: "Event is full" });
    }

    // 5) Decide status based on event.requiresApproval
    const status = event.requiresApproval ? "pending" : "approved";

    const registration = await Registration.create({
        eventId,
        userId,
        status,
        attended: false,
    });

        // Create QR token (signed JWT)
    const qrPayload = {
        regId: registration._id.toString(),
        userId: userId.toString(),
        eventId: eventId.toString(),
    };

    // 7 days validity — you can adjust
    const qrToken = jwt.sign(qrPayload, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

        // Save token inside registration
    registration.qrCodeData = qrToken;
    await registration.save();

    res.status(201).json({
        message: "Registered successfully",
        registrationId: registration._id,
        status,
    });


    // Optional: you can send notification/email here
    // res.status(201).json({
    //   message: "Registered successfully",
    //   registrationId: registration._id,
    //   status,
    // });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/events/:eventId/registrations
 * Club (event owner) can view registrations for their event
 * Admin can also view
 * Query params (optional): ?status=approved|pending|rejected
 */
router.get("/events/:eventId/registrations", auth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.query;
    const requester = req.user;

    // 1) Ensure event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // 2) Access control: allow if requester is:
    //    - the club that created the event
    //    - OR admin
    const isAdmin = (requester.role === "admin");
    const isClubOwner = event.createdBy && event.createdBy.toString() === (requester.id || requester._id?.toString());

    if (!isAdmin && !isClubOwner) return res.status(403).json({ message: "Forbidden" });

    // 3) Build filter
    const filter = { eventId };
    if (status) filter.status = status;

    const regs = await Registration.find(filter)
      .populate("userId", "name email department year")
      .sort({ createdAt: -1 });

    res.json({ count: regs.length, registrations: regs });
  } catch (err) {
    console.error("Get registrations error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PATCH /api/registrations/:id/approve
 * PATCH /api/registrations/:id/reject
 * Club approves/rejects a pending registration.
 */
router.patch("/registrations/:id/approve", auth, requireRole("club"), async (req, res) => {
  try {
    const regId = req.params.id;
    const requester = req.user;

    const reg = await Registration.findById(regId);
    if (!reg) return res.status(404).json({ message: "Registration not found" });

    // find event and check ownership
    const event = await Event.findById(reg.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // only the owning club (or admin) can approve
    const isAdmin = requester.role === "admin";
    const isClubOwner = event.createdBy && event.createdBy.toString() === (requester.id || requester._id?.toString());
    if (!isAdmin && !isClubOwner) return res.status(403).json({ message: "Forbidden" });

    // if already approved
    if (reg.status === "approved") return res.json({ message: "Already approved", registration: reg });

    // check capacity before approving
    if (event.participantLimit) {
      const count = await Registration.countDocuments({ eventId: event._id, status: { $ne: "rejected" } });
      if (count >= event.participantLimit)
        return res.status(400).json({ message: "Event is full, cannot approve" });
    }

    reg.status = "approved";
    await reg.save();

    res.json({ message: "Registration approved", registration: reg });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/registrations/:id/reject", auth, requireRole("club"), async (req, res) => {
  try {
    const regId = req.params.id;
    const requester = req.user;

    const reg = await Registration.findById(regId);
    if (!reg) return res.status(404).json({ message: "Registration not found" });

    const event = await Event.findById(reg.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const isAdmin = requester.role === "admin";
    const isClubOwner = event.createdBy && event.createdBy.toString() === (requester.id || requester._id?.toString());
    if (!isAdmin && !isClubOwner) return res.status(403).json({ message: "Forbidden" });

    if (reg.status === "rejected") return res.json({ message: "Already rejected", registration: reg });

    reg.status = "rejected";
    await reg.save();

    res.json({ message: "Registration rejected", registration: reg });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/registrations/mine
 * Student fetches their own registrations
 */
router.get("/registrations/mine", auth, requireRole("student"), async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const regs = await Registration.find({ userId })
      .populate("eventId", "title date venue createdBy")
      .sort({ createdAt: -1 });

    // CHANGED THIS
    res.json(regs);
  }
   catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
/**
 * GET /api/registrations/:regId/qrcode
 * Returns a QR code image (base64 PNG)
 */
router.get("/registrations/:regId/qrcode", auth, async (req, res) => {
  try {
    const { regId } = req.params;

    const registration = await Registration.findById(regId).populate("eventId", "title createdBy");
    if (!registration) return res.status(404).json({ message: "Registration not found" });

    // Only the student who owns the registration OR the club who created the event OR admin can view QR
    const user = req.user;

    const isOwner = registration.userId.toString() === user.id;
    const isAdmin = user.role === "admin";
    const isClubOwner =
      registration.eventId.createdBy &&
      registration.eventId.createdBy.toString() === user.id;

    if (!isOwner && !isAdmin && !isClubOwner) {
      return res.status(403).json({ message: "Not allowed to view this QR" });
    }

    if (!registration.qrCodeData) {
      return res.status(400).json({ message: "QR token missing" });
    }

    const dataUrl = await qrcode.toDataURL(registration.qrCodeData);

    res.json({ dataUrl });
  } catch (error) {
    console.error("QR Generation Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// CLUB: Verify QR and mark attendance
router.post("/registrations/verify-qr", auth, requireRole("club"), async (req, res) => {
  try {
    const { qrToken } = req.body;

    if (!qrToken) {
      return res.status(400).json({ message: "QR token required" });
    }

    // Verify QR JWT
    const decoded = jwt.verify(qrToken, process.env.JWT_SECRET);

    const { regId, eventId } = decoded;

    // Find registration
    const registration = await Registration.findById(regId);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // Prevent duplicate attendance
    if (registration.attended) {
      return res.status(400).json({ message: "Attendance already marked" });
    }

    // Check event ownership (club must own the event)
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed to verify this event" });
    }

    // Mark attendance
    registration.attended = true;
    await registration.save();

    res.json({
      message: "Attendance marked successfully",
      studentId: registration.userId,
      eventId: registration.eventId,
    });
  } catch (err) {
    console.error("QR verify error:", err);
    res.status(400).json({ message: "Invalid or expired QR" });
  }
});


module.exports = router;
