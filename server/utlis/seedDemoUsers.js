
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../Model/usermodel.js"; 

dotenv.config();

const seedDemoUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL); 

    const demoUsers = [
      {
        fullname: "Demo Job Seeker",
        email: "demo.student@paridhi.test",
        phoneNumber: "9999999901", // must be unique, made up on purpose
        password: "Demo@1234",
        role: "student",
        profile: {
          bio: "This is a demo account for exploring the platform.",
          skills: ["React", "Node.js", "MongoDB"],
        },
      },
      {
        fullname: "Demo Recruiter",
        email: "demo.recruiter@paridhi.test",
        phoneNumber: "9999999902", // must be unique too, different from above
        password: "Demo@1234",
        role: "recruiter",
        profile: {
          bio: "This is a demo recruiter account for exploring the platform.",
        },
      },
    ];

    for (const u of demoUsers) {
      const existing = await User.findOne({ email: u.email });
      if (existing) {
        console.log(`Already exists: ${u.email}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hashedPassword });
      console.log(`Created: ${u.email}`);
    }

    console.log("Seeding complete");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedDemoUsers();