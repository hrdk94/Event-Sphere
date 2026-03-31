const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const connectDB = require("./config/db");


dotenv.config();
connectDB();

// ✅ IMPORT ROUTES (ALL AT TOP)
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registerationRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const analyticsRoutes = require("./routes/analytics");

const app = express();

app.use(cors({
  origin: "https://event-sphere-lemon-seven.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));


app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api", registrationRoutes);
app.use("/api", attendanceRoutes);
app.use("/api/stats", require("./routes/stats"));
app.use("/api/club", require("./routes/club"));
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("EventSphere API Running...");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on " + PORT));