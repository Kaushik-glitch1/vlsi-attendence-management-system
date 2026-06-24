const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const ACCESS_TTL = "15m";
const REFRESH_TTL_DAYS = 30;

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TTL }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

function newRefreshToken() {
  return crypto.randomBytes(48).toString("hex");
}

function refreshExpiry() {
  return new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
}

module.exports = { signAccessToken, verifyAccessToken, newRefreshToken, refreshExpiry };
