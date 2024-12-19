import rateLimit from "express-rate-limit";

// registration rate limiter
export const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message:
    "Too many registration attempts. Please try again later",
  standardHeaders: true, 
  legacyHeaders: false, 
});
