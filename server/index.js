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
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      "http://localhost:5173",
      "https://jobseeker-nu.vercel.app",  // ← update this
    ].filter(Boolean);

    if (!origin || allowedOrigins.some(allowed => 
      origin === allowed || origin === allowed.replace(/\/$/, "")
    )) {
      callback(null, true);
    } else {
      console.log("CORS blocked:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};






app.use(cors(corsOptions));
app.use("/api/v1/user", userroute);
app.use("/api/v1/company", companyroute);
app.use("/api/v1/job", jobroute);
app.use("/api/v1/application", applicationroute);
app.use("/api/v1/chatbot", chatbotroute);
import { sendOtpEmail } from "./utlis/sendEmail.js";
import bookmarkroute from "./routes/bookmarkroute.js";

app.use("/api/v1/bookmark", bookmarkroute);



app.listen(PORT, () => {
  connectDB();
  console.log(`server is running on port ${PORT}`);
});
