import rateLimit from "express-rate-limit";

// Max 5 OTP requests per 15 minutes per IP
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many OTP requests. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Max 10 login attempts per 15 minutes per IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});