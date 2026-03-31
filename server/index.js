const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const connectDB = require("./config/db");

// ✅ LOAD ENV + DB
dotenv.config();
connectDB();

// ✅ IMPORT ROUTES (ALL AT TOP)
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registerationRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const analyticsRoutes = require("./routes/analytics");

const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ✅ API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api", registrationRoutes);
app.use("/api", attendanceRoutes);
app.use("/api/stats", require("./routes/stats"));
app.use("/api/club", require("./routes/club"));
app.use("/api/analytics", analyticsRoutes);

// ✅ OPTIONAL ROOT CHECK
app.get("/", (req, res) => {
  res.send("EventSphere API Running...");
});

// ✅ SERVE FRONTEND (React build)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Universal fallback (works with new Express)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on " + PORT));