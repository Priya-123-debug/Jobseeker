import express from "express";
import {login,register,updateprofile,logout} from "../controller/usercontroller.js"
import isAuthenciated from "../middleware/isAuthenciated.js";
import { getComapny, registerCompany,getCompanyById,updateCompany } from "../controller/companycontroller.js";
import { singleUpload } from "../middleware/multer.js";
const router=express.Router();
router.route("/register").post(isAuthenciated,registerCompany);
router.route("/get").get(isAuthenciated,getComapny);
router.route("/get/:id").get(isAuthenciated,getCompanyById);
router.route("/update/:id").put(isAuthenciated,singleUpload,updateCompany);



export default router