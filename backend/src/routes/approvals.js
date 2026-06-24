const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);
router.use(requireRole("FACULTY", "HOD", "ADMIN"));

router.get("/", async (req, res) => {
  const rows = await prisma.approvalRequest.findMany({
    include: { student: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(
    rows.map((r) => ({
      id: r.id,
      n: r.student.user.name,
      rollNo: r.student.rollNo,
      avatarSeed: r.student.avatarSeed,
      type: r.type,
      detail: r.detail,
      date: r.createdAt,
      st: r.status,
    }))
  );
});

router.patch("/:id", async (req, res) => {
  const { status } = req.body;
  if (!["APPROVED", "REJECTED"].includes(status)) return res.status(400).json({ error: "status must be APPROVED or REJECTED" });

  const row = await prisma.approvalRequest.update({
    where: { id: req.params.id },
    data: { status, approvedById: req.user.sub },
  });
  await prisma.auditLog.create({
    data: { actorId: req.user.sub, action: `APPROVAL_${status}`, targetType: "ApprovalRequest", targetId: row.id },
  });
  res.json(row);
});

module.exports = router;
