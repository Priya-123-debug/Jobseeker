import { GoogleGenAI } from "@google/genai";
import Job from "../Model/jobmodel.js";
import { company } from "../Model/company.js";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Intent (unchanged)
export const getIntentFromGemini = async (message) => {
  try {
    const prompt = `
Classify intent into ONE:

GREETING
JOB_SEARCH
JOB_STATUS
GOODBYE
UNKNOWN

Return JSON only.

Message: "${message}"
`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    return JSON.parse(text.trim());

  } catch {
    return { intent: "UNKNOWN" };
  }
};

// ⭐ Static info — things that rarely change. Edit this to describe YOUR site.
const staticSiteInfo = `
This website is a job portal that connects job seekers with hiring companies.

Features for job seekers:
- Search and filter jobs by title, location, company, and salary range
- View detailed job descriptions and requirements
- Apply to jobs directly through the platform
- Bookmark/save jobs for later
- Track application status
- Get AI-powered resume analysis for a specific job

Features for recruiters/companies:
- Post new job openings
- View and manage applicants
- See a dashboard with stats (total jobs, applicants, acceptance rate)

The platform is free to use for job seekers.
`;

// ⭐ Live data — things that change constantly, pulled fresh from DB
const buildLiveContext = async (question) => {
  const q = question.toLowerCase();
  const parts = [];

  const totalJobs = await Job.countDocuments();
  parts.push(`Total active job listings on the platform: ${totalJobs}`);

  if (q.includes("compan")) {
    const companies = await company.find().select("name").limit(20);
    parts.push(`Companies currently on the platform: ${companies.map(c => c.name).join(", ") || "None yet"}`);
  }

  if (q.includes("job") || q.includes("hiring") || q.includes("opening") || q.includes("vacan")) {
    const recentJobs = await Job.find()
      .populate("company", "name")
      .select("title location Salary jobtype experience")
      .sort({ createdAt: -1 })
      .limit(10);

    const jobList = recentJobs
      .map(j => `${j.title} at ${j.company?.name || "Unknown"} — ${j.location}, ₹${j.Salary}, ${j.jobtype}, ${j.experience} yrs exp`)
      .join("\n");

    parts.push(`Recent job openings:\n${jobList || "No jobs posted yet"}`);
  }

  if (q.includes("location") || q.includes("city") || q.includes("where")) {
    const locations = await Job.distinct("location");
    parts.push(`Locations with active job listings: ${locations.join(", ") || "None"}`);
  }

  if (q.includes("salary") || q.includes("pay") || q.includes("lpa")) {
    const salaryStats = await Job.aggregate([
      { $group: { _id: null, min: { $min: "$Salary" }, max: { $max: "$Salary" }, avg: { $avg: "$Salary" } } }
    ]);
    if (salaryStats[0]) {
      const s = salaryStats[0];
      parts.push(`Salary range across all jobs: ₹${s.min} to ₹${s.max} (avg ₹${Math.round(s.avg)})`);
    }
  }

  return parts.join("\n\n");
};

// Website Knowledge — now combines static + live data
export const getWebsiteAnswer = async (question) => {
  try {
    const liveContext = await buildLiveContext(question);

    const prompt = `
You are a helpful assistant for a job portal website.
Answer the user's question using the information below.
If the answer isn't in either section, say you don't have that information — do not make anything up.
Keep answers short and conversational (2-4 sentences), suitable for a chat widget.

ABOUT THE WEBSITE (general info):
${staticSiteInfo}

LIVE WEBSITE DATA (current jobs/companies):
${liveContext}

QUESTION:
${question}
`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    });

    return (
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, info not available."
    );

  } catch (err) {
    console.error("getWebsiteAnswer error:", err);
    return "AI error.";
  }
};