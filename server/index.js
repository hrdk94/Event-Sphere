const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("EventSphere API Running...");
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on " + PORT));

const eventRoutes = require("./routes/eventRoutes");
app.use("/api/events", eventRoutes);

const registrationRoutes = require("./routes/registerationRoutes");
app.use("/api", registrationRoutes);

const attendanceRoutes = require("./routes/attendanceRoutes");
app.use("/api", attendanceRoutes);

app.use("/api/stats", require("./routes/stats"));

app.use("/api/club", require("./routes/club"));

const analyticsRoutes = require("./routes/analytics");
app.use("/api/analytics", analyticsRoutes);