import express from "express";
const router=express.Router();


import isAuthenciated from "../middleware/isAuthenciated.js";
import {applyjob,getAppliedJobs,getApplicants,updatestatus} from "../controller/applicationcontroller.js"

router.route("/apply/:id").post(isAuthenciated,applyjob);
router.route("/get").get(isAuthenciated,getAppliedJobs);
router.route("/:id/applicants").get(isAuthenciated,getApplicants);
router.route("/status/:id/update").post(isAuthenciated,updatestatus);



export default router



