const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const logs = await prisma.auditLog.findMany({
    include: { actor: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  res.json(
    logs.map((l) => ({
      id: l.id,
      action: l.action,
      actor: l.actor?.name || "System",
      targetType: l.targetType,
      time: l.createdAt,
    }))
  );
});

module.exports = router;
