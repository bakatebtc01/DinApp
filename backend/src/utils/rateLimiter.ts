import rateLimit from "express-rate-limit";

// Limiter for OTP requests (5 requests per 60 seconds per IP)
export const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { error: "Too many OTP requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for login/signup (10 requests per 15 minutes per IP)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    error: "Too many authentication attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
