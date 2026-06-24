const express = require("express");
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { signAccessToken, newRefreshToken, refreshExpiry } = require("../lib/tokens");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const REFRESH_COOKIE = "vlsi_refresh";
const isProd = process.env.NODE_ENV === "production";

function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    expires: refreshExpiry(),
    path: "/api/auth",
  });
}

async function userPayload(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { student: true, faculty: true },
  });
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  deviceName: z.string().optional(),
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid email or password format" });
  const { email, password, deviceName } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const accessToken = signAccessToken(user);
  const refreshToken = newRefreshToken();

  await prisma.deviceSession.create({
    data: {
      userId: user.id,
      deviceName: deviceName || "Unknown device",
      location: "Unknown",
      refreshToken,
      current: true,
    },
  });

  await prisma.auditLog.create({
    data: { actorId: user.id, action: "LOGIN", targetType: "User", targetId: user.id },
  });

  setRefreshCookie(res, refreshToken);
  res.json({ accessToken, user: await userPayload(user.id) });
});

router.post("/refresh", async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) return res.status(401).json({ error: "No refresh token" });

  const device = await prisma.deviceSession.findUnique({ where: { refreshToken: token } });
  if (!device) return res.status(401).json({ error: "Refresh token invalid" });

  const user = await prisma.user.findUnique({ where: { id: device.userId } });
  if (!user) return res.status(401).json({ error: "User not found" });

  await prisma.deviceSession.update({
    where: { id: device.id },
    data: { lastActiveAt: new Date() },
  });

  const accessToken = signAccessToken(user);
  res.json({ accessToken, user: await userPayload(user.id) });
});

router.post("/logout", async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (token) {
    await prisma.deviceSession.deleteMany({ where: { refreshToken: token } });
  }
  res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
  res.json({ ok: true });
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await userPayload(req.user.sub);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user });
});

module.exports = router;
