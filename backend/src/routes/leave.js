const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

const STEP_NAMES = ["Submitted", "Faculty review", "HOD approval", "Recorded"];

function daysBetween(from, to) {
  return Math.round((new Date(to) - new Date(from)) / 86400000) + 1;
}

router.get("/", requireRole("STUDENT", "FACULTY", "HOD", "ADMIN"), async (req, res) => {
  let where = {};
  if (req.user.role === "STUDENT") {
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user.sub } });
    where = { studentId: profile.id };
  }
  const rows = await prisma.leaveRequest.findMany({
    where,
    include: { student: { include: { user: true } }, steps: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(
    rows.map((r) => ({
      id: r.id,
      n: r.student.user.name,
      id_: r.student.rollNo,
      avatarSeed: r.student.avatarSeed,
      type: r.type,
      from: r.fromDate,
      to: r.toDate,
      days: r.days,
      doc: r.hasDocument,
      status: r.status,
      steps: r.steps,
    }))
  );
});

router.post("/", requireRole("STUDENT"), async (req, res) => {
  const { type, fromDate, toDate, hasDocument } = req.body;
  if (!type || !fromDate || !toDate) return res.status(400).json({ error: "type, fromDate, toDate are required" });

  const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user.sub } });
  const request = await prisma.leaveRequest.create({
    data: {
      studentId: profile.id,
      type,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      days: daysBetween(fromDate, toDate),
      hasDocument: !!hasDocument,
      steps: {
        create: STEP_NAMES.map((name, i) => ({ name, order: i, done: i === 0, actedAt: i === 0 ? new Date() : null })),
      },
    },
    include: { steps: true },
  });
  res.status(201).json(request);
});

router.patch("/:id", requireRole("FACULTY", "HOD", "ADMIN"), async (req, res) => {
  const { status } = req.body;
  if (!["APPROVED", "REJECTED"].includes(status)) return res.status(400).json({ error: "status must be APPROVED or REJECTED" });

  const request = await prisma.leaveRequest.update({
    where: { id: req.params.id },
    data: {
      status,
      steps: {
        updateMany: { where: { leaveRequestId: req.params.id }, data: { done: true, actedAt: new Date() } },
      },
    },
    include: { steps: true },
  });

  await prisma.auditLog.create({
    data: { actorId: req.user.sub, action: `LEAVE_${status}`, targetType: "LeaveRequest", targetId: request.id },
  });
  res.json(request);
});

module.exports = router;
