const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

function pct(records) {
  if (!records.length) return 0;
  const present = records.filter((r) => r.status === "PRESENT" || r.status === "ON_DUTY").length;
  return Math.round((present / records.length) * 100);
}

function weekKey(date) {
  const d = new Date(date);
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - onejan) / 86400000 + onejan.getDay() + 1) / 7);
  return `W${week}`;
}

async function currentStudentProfile(req) {
  return prisma.studentProfile.findUnique({ where: { userId: req.user.sub } });
}

// Subject-wise attendance % for the logged-in student
router.get("/subjects", requireRole("STUDENT"), async (req, res) => {
  const profile = await currentStudentProfile(req);
  if (!profile) return res.status(404).json({ error: "Student profile not found" });

  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: profile.id },
    include: { course: true },
  });

  const result = await Promise.all(
    enrollments.map(async (e) => {
      const records = await prisma.attendanceRecord.findMany({
        where: { studentId: profile.id, session: { courseId: e.courseId } },
      });
      return { code: e.course.code, name: e.course.name, pct: pct(records) };
    })
  );
  res.json(result);
});

// Weekly trend for the logged-in student (last 8 weeks)
router.get("/trend", requireRole("STUDENT", "FACULTY", "HOD", "ADMIN"), async (req, res) => {
  let where = {};
  if (req.user.role === "STUDENT") {
    const profile = await currentStudentProfile(req);
    if (!profile) return res.status(404).json({ error: "Student profile not found" });
    where = { studentId: profile.id };
  } else if (req.query.courseId) {
    where = { session: { courseId: req.query.courseId } };
  }

  const records = await prisma.attendanceRecord.findMany({ where, orderBy: { markedAt: "asc" } });
  const byWeek = new Map();
  for (const r of records) {
    const wk = weekKey(r.markedAt);
    if (!byWeek.has(wk)) byWeek.set(wk, []);
    byWeek.get(wk).push(r);
  }
  const weeks = [...byWeek.entries()].slice(-8).map(([w, recs]) => ({ w, a: pct(recs) }));
  res.json(weeks);
});

// Today's classes for the logged-in student
router.get("/today", requireRole("STUDENT"), async (req, res) => {
  const profile = await currentStudentProfile(req);
  if (!profile) return res.status(404).json({ error: "Student profile not found" });

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const sessions = await prisma.classSession.findMany({
    where: { date: { gte: start, lte: end }, course: { enrollments: { some: { studentId: profile.id } } } },
    include: { course: true, faculty: { include: { user: true } }, attendance: { where: { studentId: profile.id } } },
    orderBy: { startTime: "asc" },
  });

  res.json(
    sessions.map((s) => ({
      id: s.id,
      t: s.startTime,
      code: s.course.code,
      name: s.course.name,
      room: s.room,
      fac: s.faculty?.user.name || "TBA",
      status: s.attendance[0]?.status || (s.status === "LIVE" ? "Upcoming" : "Upcoming"),
    }))
  );
});

// Faculty: list class sessions they teach (optionally filter by date)
router.get("/sessions", requireRole("FACULTY", "LAB", "HOD", "ADMIN"), async (req, res) => {
  const faculty = await prisma.facultyProfile.findUnique({ where: { userId: req.user.sub } });
  const where = faculty ? { facultyId: faculty.id } : {};
  const sessions = await prisma.classSession.findMany({
    where,
    include: { course: true },
    orderBy: { date: "desc" },
    take: 50,
  });
  res.json(sessions);
});

router.post("/sessions", requireRole("FACULTY", "HOD", "ADMIN"), async (req, res) => {
  const { courseId, room, date, startTime, endTime } = req.body;
  if (!courseId || !room || !date || !startTime || !endTime) {
    return res.status(400).json({ error: "courseId, room, date, startTime, endTime are required" });
  }
  const faculty = await prisma.facultyProfile.findUnique({ where: { userId: req.user.sub } });
  const session = await prisma.classSession.create({
    data: { courseId, room, date: new Date(date), startTime, endTime, facultyId: faculty?.id, status: "LIVE" },
  });
  res.status(201).json(session);
});

// Session roster with each enrolled student's current mark
router.get("/sessions/:id", requireRole("FACULTY", "LAB", "HOD", "ADMIN"), async (req, res) => {
  const session = await prisma.classSession.findUnique({
    where: { id: req.params.id },
    include: { course: { include: { enrollments: { include: { student: { include: { user: true } } } } } }, attendance: true },
  });
  if (!session) return res.status(404).json({ error: "Session not found" });

  const marks = new Map(session.attendance.map((a) => [a.studentId, a]));
  res.json({
    id: session.id,
    course: session.course,
    room: session.room,
    date: session.date,
    locked: session.locked,
    roster: session.course.enrollments.map((e) => ({
      studentId: e.student.id,
      name: e.student.user.name,
      rollNo: e.student.rollNo,
      avatarSeed: e.student.avatarSeed,
      status: marks.get(e.student.id)?.status || "PRESENT",
      method: marks.get(e.student.id)?.method || "MANUAL",
    })),
  });
});

router.post("/sessions/:id/mark", requireRole("FACULTY", "LAB", "HOD", "ADMIN"), async (req, res) => {
  const { studentId, status, method } = req.body;
  if (!studentId || !status) return res.status(400).json({ error: "studentId and status are required" });

  const record = await prisma.attendanceRecord.upsert({
    where: { sessionId_studentId: { sessionId: req.params.id, studentId } },
    update: { status, method: method || "MANUAL", markedById: req.user.sub, markedAt: new Date() },
    create: { sessionId: req.params.id, studentId, status, method: method || "MANUAL", markedById: req.user.sub },
  });
  res.json(record);
});

router.post("/sessions/:id/lock", requireRole("FACULTY", "HOD", "ADMIN"), async (req, res) => {
  const session = await prisma.classSession.update({
    where: { id: req.params.id },
    data: { locked: true, status: "COMPLETED" },
  });
  await prisma.auditLog.create({
    data: { actorId: req.user.sub, action: "ATTENDANCE_LOCKED", targetType: "ClassSession", targetId: session.id },
  });
  res.json(session);
});

// Student's own register, most recent first
router.get("/register", requireRole("STUDENT"), async (req, res) => {
  const profile = await currentStudentProfile(req);
  if (!profile) return res.status(404).json({ error: "Student profile not found" });
  const records = await prisma.attendanceRecord.findMany({
    where: { studentId: profile.id },
    include: { session: { include: { course: true } } },
    orderBy: { markedAt: "desc" },
    take: 20,
  });
  res.json(
    records.map((r) => ({
      date: r.markedAt,
      code: r.session.course.code,
      name: r.session.course.name,
      method: r.method,
      status: r.status,
    }))
  );
});

// Per-day attendance status for the logged-in student over the last 16 weeks
router.get("/heatmap", requireRole("STUDENT"), async (req, res) => {
  const profile = await currentStudentProfile(req);
  if (!profile) return res.status(404).json({ error: "Student profile not found" });

  const since = new Date();
  since.setDate(since.getDate() - 16 * 7);

  const records = await prisma.attendanceRecord.findMany({
    where: { studentId: profile.id, markedAt: { gte: since } },
    orderBy: { markedAt: "asc" },
  });

  const byDay = new Map();
  for (const r of records) {
    const key = r.markedAt.toISOString().slice(0, 10);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push(r.status);
  }

  const days = [...byDay.entries()].map(([date, statuses]) => {
    const worst = statuses.includes("ABSENT") ? "ABSENT" : statuses.includes("LATE") ? "LATE" : "PRESENT";
    return { date, status: worst };
  });
  res.json(days);
});

// Students below the 75% threshold (faculty/HOD risk list)
router.get("/risk", requireRole("FACULTY", "HOD", "ADMIN", "LAB"), async (req, res) => {
  const students = await prisma.studentProfile.findMany({
    include: { user: true, attendanceRecords: true },
  });
  const atRisk = students
    .map((s) => ({ id: s.id, name: s.user.name, rollNo: s.rollNo, avatarSeed: s.avatarSeed, pct: pct(s.attendanceRecords) }))
    .filter((s) => s.pct < 75)
    .sort((a, b) => a.pct - b.pct);
  res.json(atRisk);
});

module.exports = router;
