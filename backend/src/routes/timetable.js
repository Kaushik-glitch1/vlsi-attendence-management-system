const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const slots = await prisma.timetableSlot.findMany({
    include: { course: true, faculty: { include: { user: true } } },
  });
  res.json(
    slots.map((s) => ({
      id: s.id,
      day: s.day,
      rowIndex: s.rowIndex,
      code: s.course.code,
      name: s.course.name,
      room: s.room,
      faculty: s.faculty?.user.name,
      colorTag: s.colorTag,
    }))
  );
});

router.post("/", requireRole("HOD", "ADMIN"), async (req, res) => {
  const { day, rowIndex, courseId, facultyId, room, colorTag } = req.body;
  if (!day || rowIndex == null || !courseId || !room) {
    return res.status(400).json({ error: "day, rowIndex, courseId, room are required" });
  }
  const slot = await prisma.timetableSlot.upsert({
    where: { day_rowIndex: { day, rowIndex } },
    update: { courseId, facultyId, room, colorTag },
    create: { day, rowIndex, courseId, facultyId, room, colorTag: colorTag || "blue" },
  });
  res.status(201).json(slot);
});

module.exports = router;
