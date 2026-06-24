const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const rows = await prisma.internship.findMany({
    include: { student: { include: { user: true } }, company: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(
    rows.map((i) => ({
      id: i.id,
      n: i.student.user.name,
      avatarSeed: i.student.avatarSeed,
      co: i.company.name,
      role: i.role,
      stipend: i.stipend,
      stage: i.stage,
      mentor: i.mentor,
    }))
  );
});

router.post("/", requireRole("STUDENT", "FACULTY", "HOD", "ADMIN"), async (req, res) => {
  const { studentId, companyId, role, stipend, mentor } = req.body;
  if (!studentId || !companyId || !role) return res.status(400).json({ error: "studentId, companyId, role are required" });
  const internship = await prisma.internship.create({
    data: { studentId, companyId, role, stipend: stipend || "TBD", mentor },
  });
  res.status(201).json(internship);
});

router.patch("/:id", requireRole("STUDENT", "FACULTY", "HOD", "ADMIN"), async (req, res) => {
  const { stage } = req.body;
  if (!stage) return res.status(400).json({ error: "stage is required" });
  const internship = await prisma.internship.update({ where: { id: req.params.id }, data: { stage } });
  res.json(internship);
});

module.exports = router;
