const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const rows = await prisma.notification.findMany({
    where: { userId: req.user.sub },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  res.json(rows);
});

router.patch("/:id/read", async (req, res) => {
  const row = await prisma.notification.update({
    where: { id: req.params.id },
    data: { read: true },
  });
  res.json(row);
});

router.post("/read-all", async (req, res) => {
  await prisma.notification.updateMany({ where: { userId: req.user.sub, read: false }, data: { read: true } });
  res.json({ ok: true });
});

module.exports = router;
