const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.patch("/security", async (req, res) => {
  const { mfaEnabled, pushEnabled, smsEnabled } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user.sub },
    data: {
      ...(mfaEnabled != null && { mfaEnabled }),
      ...(pushEnabled != null && { pushEnabled }),
      ...(smsEnabled != null && { smsEnabled }),
    },
  });
  res.json({ mfaEnabled: user.mfaEnabled, pushEnabled: user.pushEnabled, smsEnabled: user.smsEnabled });
});

router.get("/devices", async (req, res) => {
  const devices = await prisma.deviceSession.findMany({
    where: { userId: req.user.sub },
    orderBy: { lastActiveAt: "desc" },
  });
  res.json(devices);
});

router.delete("/devices/:id", async (req, res) => {
  await prisma.deviceSession.deleteMany({ where: { id: req.params.id, userId: req.user.sub, current: false } });
  res.json({ ok: true });
});

module.exports = router;
