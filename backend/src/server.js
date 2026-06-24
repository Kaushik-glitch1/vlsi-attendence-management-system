require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const attendanceRoutes = require("./routes/attendance");
const leaveRoutes = require("./routes/leave");
const approvalRoutes = require("./routes/approvals");
const labRoutes = require("./routes/labs");
const projectRoutes = require("./routes/projects");
const internshipRoutes = require("./routes/internships");
const placementRoutes = require("./routes/placements");
const timetableRoutes = require("./routes/timetable");
const reportRoutes = require("./routes/reports");
const notificationRoutes = require("./routes/notifications");
const settingsRoutes = require("./routes/settings");
const auditRoutes = require("./routes/audit");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ ok: true, service: "vlsi-ams-backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/labs", labRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/audit", auditRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`VLSI AMS backend listening on :${PORT}`));
