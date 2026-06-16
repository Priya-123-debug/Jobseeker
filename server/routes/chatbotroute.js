import express from "express";
import chatbotcontroller from "../controller/chatbotcontroller.js";
const router=express.Router();





router.route("/getchatbot").post(chatbotcontroller);




export default router