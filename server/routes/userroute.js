import express from "express";
import {
  login,
  register,
  updateprofile,
  logout,
  getMe,
  sendOtp,
  verifyOtp,
  resetPassword
} from "../controller/usercontroller.js";
import isAuthenciated from "../middleware/isAuthenciated.js";
import { singleUpload, multiUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/register", singleUpload, register);
router.post("/login", login);
router.get("/logout", isAuthenciated, logout);

router.get("/me", isAuthenciated, getMe);
router.put("/profile/update", isAuthenciated, multiUpload, updateprofile);

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;