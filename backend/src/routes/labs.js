const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const labs = await prisma.lab.findMany({
    include: {
      course: true,
      instructor: { include: { user: true } },
      labSessions: { orderBy: { date: "desc" }, take: 1, include: { attendances: true } },
    },
  });
  res.json(
    labs.map((l) => {
      const latest = l.labSessions[0];
      const present = latest ? latest.attendances.filter((a) => a.status === "PRESENT").length : 0;
      return {
        id: l.id,
        n: l.name,
        course: `${l.course.code} · ${l.course.name}`,
        inst: l.instructor?.user.name || "TBA",
        seats: l.seats,
        present,
        status: latest?.status || "SCHEDULED",
        img: l.imageKey,
      };
    })
  );
});

router.post("/:id/sessions", requireRole("FACULTY", "LAB", "ADMIN"), async (req, res) => {
  const session = await prisma.labSession.create({
    data: { labId: req.params.id, status: "LIVE" },
  });
  res.status(201).json(session);
});

router.post("/sessions/:sessionId/mark", requireRole("FACULTY", "LAB", "ADMIN"), async (req, res) => {
  const { studentId, status } = req.body;
  const session = await prisma.labSession.findUnique({ where: { id: req.params.sessionId } });
  if (!session) return res.status(404).json({ error: "Lab session not found" });

  const record = await prisma.studentLabAttendance.upsert({
    where: { labSessionId_studentId: { labSessionId: session.id, studentId } },
    update: { status },
    create: { labSessionId: session.id, labId: session.labId, studentId, status },
  });
  res.json(record);
});

module.exports = router;
