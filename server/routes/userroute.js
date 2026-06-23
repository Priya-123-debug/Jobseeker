import express from "express";
import { login, register, updateprofile, logout, getMe, sendOtp, verifyOtp, resetPassword } from "../controller/usercontroller.js";
import isAuthenciated from "../middleware/isAuthenciated.js";
import { singleUpload } from "../middleware/multer.js";
import { otpLimiter, loginLimiter } from "../middleware/ratelimit.js";

const router = express.Router();

// Auth routes
router.post("/register", singleUpload, register);
router.post("/login", loginLimiter, login);
router.get("/logout", isAuthenciated, logout);

// Profile routes
router.get("/me", isAuthenciated, getMe);
router.put("/profile/update", isAuthenciated, singleUpload, updateprofile);

// OTP routes
router.post("/send-otp", otpLimiter, sendOtp);
router.post("/verify-otp", otpLimiter, verifyOtp);
router.post("/reset-password", resetPassword);

export default router;