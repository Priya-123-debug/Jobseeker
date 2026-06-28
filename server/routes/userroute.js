import express from "express";
import {
  login, register, updateprofile, logout,
  getMe, sendOtp, verifyOtp, resetPassword
} from "../controller/usercontroller.js";
import isAuthenciated from "../middleware/isAuthenciated.js";
import { otpLimiter, loginLimiter } from "../middleware/ratelimit.js";
import { singleUpload, resumeUpload, multiUpload } from "../middleware/multer.js";

const router = express.Router(); // ✅ declare BEFORE using router

// Auth routes
router.post("/register", singleUpload, register);         // profile image only
router.post("/login", loginLimiter, login);
router.get("/logout", isAuthenciated, logout);

// Profile routes
router.get("/me", isAuthenciated, getMe);
router.put("/profile/update", isAuthenciated, multiUpload, updateprofile); // profile image + resume

// OTP routes
router.post("/send-otp", otpLimiter, sendOtp);
router.post("/verify-otp", otpLimiter, verifyOtp);
router.post("/reset-password", resetPassword);

export default router;