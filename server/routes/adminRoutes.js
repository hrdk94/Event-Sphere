const express = require("express");
const User = require("../models/User");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

/*
GET /api/admin/users
Admin only
Returns all users
*/
router.get("/users", auth, requireRole("admin"), async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

module.exports = router;