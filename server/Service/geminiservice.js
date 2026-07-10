import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import Job from "../Model/jobmodel.js";
import { company } from "../Model/company.js";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ⭐ Tries Gemini first, falls back to Groq automatically if Gemini fails
const generateWithFallback = async (prompt) => {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) return text;
    throw new Error("Empty Gemini response");
  } catch (err) {
    console.warn("Gemini failed, falling back to Groq:", err.message);
    try {
      const groqResponse = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
      });
      return groqResponse.choices[0].message.content;
    } catch (groqErr) {
      console.error("Groq also failed:", groqErr.message);
      throw groqErr;
    }
  }
};

export const getIntentFromGemini = async (message) => {
  try {
    const prompt = `
Classify intent into ONE:

GREETING
JOB_SEARCH
JOB_STATUS
COMPANY_INFO
LOCATION_INFO
THANKS
GOODBYE
UNKNOWN

Return JSON only, like {"intent": "JOB_SEARCH"}.

Message: "${message}"
`;
    const text = await generateWithFallback(prompt);
    return JSON.parse(text.trim().replace(/```json|```/g, ""));
  } catch {
    return { intent: "UNKNOWN" };
  }
};

export const getKnownEntities = async () => {
  const [locations, companies] = await Promise.all([
    Job.distinct("location"),
    company.find().select("name"),
  ]);
  return {
    locations: locations.filter(Boolean),
    companies: companies.map(c => c.name).filter(Boolean),
  };
};

export const extractEntities = (message, known) => {
  const msg = message.toLowerCase();
  const found = { location: null, company: null };
  found.location = known.locations.find(loc => msg.includes(loc.toLowerCase())) || null;
  found.company = known.companies.find(c => msg.includes(c.toLowerCase())) || null;

  const stripWords = ["job", "jobs", "in", "at", "for", "show", "me", "find", "search", "openings", "opening",
    ...(found.location ? [found.location.toLowerCase()] : []),
    ...(found.company ? [found.company.toLowerCase()] : [])];
  const titleGuess = msg.split(/\s+/).filter(w => !stripWords.includes(w)).join(" ").trim();
  found.titleHint = titleGuess || null;
  return found;
};

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

const buildLiveContext = async (question) => {
  const q = question.toLowerCase();
  const parts = [];

  const totalJobs = await Job.countDocuments();
  parts.push(`Total active job listings: ${totalJobs}`);

  if (q.includes("compan")) {
    const companies = await company.find().select("name").limit(20);
    parts.push(`Companies on the platform: ${companies.map(c => c.name).join(", ") || "None yet"}`);
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
    const byLocation = await Job.aggregate([
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    parts.push(`Jobs by location: ${byLocation.map(l => `${l._id} (${l.count})`).join(", ") || "None"}`);
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

export const getWebsiteAnswer = async (question) => {
  try {
    const liveContext = await buildLiveContext(question);
    const prompt = `
You are a helpful assistant for a job portal website.
Answer using the information below. If the answer isn't there, say you don't have that information.
Keep answers short (2-4 sentences), conversational, suitable for a chat widget.

ABOUT THE WEBSITE:
${staticSiteInfo}

LIVE DATA:
${liveContext}

QUESTION:
${question}
`;
    return await generateWithFallback(prompt);
  } catch (err) {
    console.error("getWebsiteAnswer error (both providers failed):", err);
    return "I'm having trouble connecting right now — please try again in a moment.";
  }
};