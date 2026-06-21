import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1', '8.8.8.8']);
import express from "express";
const app = express();
const PORT = process.env.PORT || 5000;
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utlis/db.js";
import userroute from "./routes/userroute.js";
import companyroute from "./routes/companyroute.js";
import jobroute from "./routes/jobroute.js";
import applicationroute from "./routes/applicationroute.js";
import chatbotroute from "./routes/chatbotroute.js";

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173"||"https://seeker-3h0o45n52-supriya-kumaris-projects.vercel.app/",
  credentials: true,
};
app.use(cors(corsOptions));
app.use("/api/v1/user", userroute);
app.use("/api/v1/company", companyroute);
app.use("/api/v1/job", jobroute);
app.use("/api/v1/application", applicationroute);
app.use("/api/v1/chatbot", chatbotroute);

app.listen(PORT, () => {
  connectDB();
  console.log(`server is running on port ${PORT}`);
});
