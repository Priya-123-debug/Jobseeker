import express from "express";
import { analyzeResume } from "../controller/resumeanalyzercontroller.js";
import isAuthenciated from "../middleware/isAuthenciated.js";

const router = express.Router();

router.post("/analyze", isAuthenciated, analyzeResume);

export default router;