import express from "express";
import { toggleBookmark, getBookmarks } from "../controller/bookmarkcontroller.js";
import isAuthenciated from "../middleware/isAuthenciated.js";

const router = express.Router();

router.post("/toggle/:id", isAuthenciated, toggleBookmark);
router.get("/all", isAuthenciated, getBookmarks);

export default router;