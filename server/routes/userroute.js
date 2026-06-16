import express from "express";
import {login,register,updateprofile,logout} from "../controller/usercontroller.js"
import isAuthenciated from "../middleware/isAuthenciated.js";
import { singleUpload } from "../middleware/multer.js";
import { getMe } from "../controller/usercontroller.js";
import { sendOtp } from "../controller/usercontroller.js";
import { verifyOtp } from "../controller/usercontroller.js";
import { resetPassword } from "../controller/usercontroller.js";
const router=express.Router();
router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.get("/logout", isAuthenciated, logout);


router.get("/me", isAuthenciated, getMe);
router.post("/send-otp", sendOtp);




router.post("/verify-otp", verifyOtp);


router.post("/reset-password", resetPassword);



router.route("/profile/update").put(isAuthenciated,updateprofile);
export default router