import express from "express";

import isAuthenciated from "../middleware/isAuthenciated.js";
import { postjob, getAlljobs, getjobById, getadminjobs, getRecruiterStats } from "../controller/jobcontroller.js"
const router=express.Router();
router.route("/post").post(isAuthenciated,postjob);
router.route("/get").get(isAuthenciated,getAlljobs);
router.route("/getadminjobs").get(isAuthenciated,getadminjobs);
router.route("/get/:id").get(isAuthenciated,getjobById);
router.route("/stats").get(isAuthenciated, getRecruiterStats);





export default router