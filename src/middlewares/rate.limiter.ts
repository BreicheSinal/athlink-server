import rateLimit from "express-rate-limit";

// registration rate limiter
export const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: "Too many registration attempts. Please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// login rate limiter
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per hour
  message: "Too many login attempts from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
