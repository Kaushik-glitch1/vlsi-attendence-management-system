const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const placed = await prisma.placement.findMany({
    include: { student: { include: { user: true } }, company: true },
    orderBy: { id: "desc" },
  });
  res.json(
    placed.map((p) => ({
      n: p.student.user.name,
      id: p.student.rollNo,
      avatarSeed: p.student.avatarSeed,
      co: p.company.name,
      ctc: p.ctc,
      role: p.role,
    }))
  );
});

router.get("/companies", async (req, res) => {
  const companies = await prisma.company.findMany({
    include: { _count: { select: { placements: true } } },
  });
  res.json(
    companies
      .map((c) => ({ n: c.name, c: c.color, offers: c._count.placements, ctc: c.ctcTop }))
      .sort((a, b) => b.offers - a.offers)
  );
});

router.post("/", requireRole("FACULTY", "HOD", "ADMIN"), async (req, res) => {
  const { studentId, companyId, ctc, role, year } = req.body;
  if (!studentId || !companyId || !ctc || !role) {
    return res.status(400).json({ error: "studentId, companyId, ctc, role are required" });
  }
  const placement = await prisma.placement.create({
    data: { studentId, companyId, ctc, role, year: year || new Date().getFullYear() },
  });
  res.status(201).json(placement);
});

module.exports = router;
