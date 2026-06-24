const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const projects = await prisma.project.findMany({
    include: { lead: { include: { user: true } }, members: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(
    projects.map((p) => ({
      id: p.id,
      t: p.title,
      lead: p.lead.user.name,
      leadAvatarSeed: p.lead.avatarSeed,
      team: p.members.length + 1,
      prog: p.progress,
      stage: p.stage,
      tag: p.tag,
      due: p.dueDate,
      img: p.imageKey,
    }))
  );
});

router.post("/", requireRole("STUDENT", "FACULTY", "HOD", "ADMIN"), async (req, res) => {
  const { title, leadId, stage, tag, dueDate, memberIds } = req.body;
  if (!title || !leadId || !stage || !tag || !dueDate) {
    return res.status(400).json({ error: "title, leadId, stage, tag, dueDate are required" });
  }
  const project = await prisma.project.create({
    data: {
      title,
      leadId,
      stage,
      tag,
      dueDate: new Date(dueDate),
      members: { create: (memberIds || []).map((studentId) => ({ studentId })) },
    },
  });
  res.status(201).json(project);
});

router.patch("/:id", requireRole("STUDENT", "FACULTY", "HOD", "ADMIN"), async (req, res) => {
  const { progress, stage } = req.body;
  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: { ...(progress != null && { progress }), ...(stage && { stage }) },
  });
  res.json(project);
});

module.exports = router;
