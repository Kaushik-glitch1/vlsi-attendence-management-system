const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);
router.use(requireRole("FACULTY", "HOD", "ADMIN"));

function pct(records) {
  if (!records.length) return 0;
  const present = records.filter((r) => r.status === "PRESENT" || r.status === "ON_DUTY").length;
  return Math.round((present / records.length) * 100);
}

router.get("/overview", async (req, res) => {
  const students = await prisma.studentProfile.findMany({ include: { attendanceRecords: true } });
  const pcts = students.map((s) => pct(s.attendanceRecords));
  const dept = pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0;

  const bands = { ge90: 0, "75to90": 0, "60to75": 0, lt60: 0 };
  for (const p of pcts) {
    if (p >= 90) bands.ge90++;
    else if (p >= 75) bands["75to90"]++;
    else if (p >= 60) bands["60to75"]++;
    else bands.lt60++;
  }

  const lowAttendance = pcts.filter((p) => p < 75).length;
  const totalOffers = await prisma.placement.count();

  res.json({
    deptAttendancePct: dept,
    totalStudents: students.length,
    lowAttendance,
    totalOffers,
    bands,
  });
});

router.get("/faculty-performance", async (req, res) => {
  const faculty = await prisma.facultyProfile.findMany({
    include: { user: true, sessions: { include: { attendance: true } } },
  });
  res.json(
    faculty.map((f) => {
      const sessions = f.sessions;
      const locked = sessions.filter((s) => s.locked).length;
      const ontime = sessions.length ? Math.round((locked / sessions.length) * 100) : 100;
      return {
        n: f.user.name,
        avatarSeed: f.avatarSeed,
        cls: sessions.length,
        ontime,
      };
    })
  );
});

module.exports = router;
