const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

function pctFor(records) {
  if (!records.length) return 0;
  const present = records.filter((r) => r.status === "PRESENT" || r.status === "ON_DUTY").length;
  return Math.round((present / records.length) * 100);
}

router.get("/", requireRole("FACULTY", "HOD", "ADMIN", "LAB"), async (req, res) => {
  const students = await prisma.studentProfile.findMany({
    include: { user: true, attendanceRecords: true },
    orderBy: { user: { name: "asc" } },
  });
  res.json(
    students.map((s) => ({
      id: s.id,
      rollNo: s.rollNo,
      name: s.user.name,
      batch: s.batch,
      semester: s.semester,
      avatarSeed: s.avatarSeed,
      pct: pctFor(s.attendanceRecords),
    }))
  );
});

router.get("/me", requireRole("STUDENT"), async (req, res) => {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: req.user.sub },
    include: { user: true, attendanceRecords: true, enrollments: { include: { course: true } } },
  });
  if (!profile) return res.status(404).json({ error: "Student profile not found" });
  res.json({
    id: profile.id,
    rollNo: profile.rollNo,
    name: profile.user.name,
    batch: profile.batch,
    semester: profile.semester,
    avatarSeed: profile.avatarSeed,
    overallPct: pctFor(profile.attendanceRecords),
    courses: profile.enrollments.map((e) => e.course),
  });
});

router.get("/:id", requireRole("FACULTY", "HOD", "ADMIN", "LAB", "PARENT"), async (req, res) => {
  if (req.user.role === "PARENT") {
    const link = await prisma.parentLink.findFirst({
      where: { parentUserId: req.user.sub, studentId: req.params.id },
    });
    if (!link) return res.status(403).json({ error: "Not your ward" });
  }
  const s = await prisma.studentProfile.findUnique({
    where: { id: req.params.id },
    include: {
      user: true,
      attendanceRecords: { include: { session: { include: { course: true } } } },
    },
  });
  if (!s) return res.status(404).json({ error: "Student not found" });
  res.json({
    id: s.id,
    rollNo: s.rollNo,
    name: s.user.name,
    batch: s.batch,
    semester: s.semester,
    avatarSeed: s.avatarSeed,
    overallPct: pctFor(s.attendanceRecords),
    records: s.attendanceRecords.map((r) => ({
      date: r.markedAt,
      course: r.session.course.code,
      status: r.status,
      method: r.method,
    })),
  });
});

module.exports = router;
