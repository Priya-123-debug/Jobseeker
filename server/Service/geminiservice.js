import OpenAI from "openai";
import Job from "../Model/jobmodel.js";
import { company } from "../Model/company.js";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Single-provider generation via Groq
const generateWithFallback = async (prompt) => {
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: prompt }],
  });
  return response.choices[0].message.content;
};

export const getIntentFromGemini = async (message) => {
  try {
    const prompt = `
Classify the user's message into ONE intent:

GREETING - hello, hi, hey
JOB_SEARCH - user wants to find/search for a specific job (mentions a role, title, location, or company they want)
JOB_STATUS - user is asking about the status of an application they submitted
COMPANY_INFO - user is asking about a SPECIFIC company, or wants the list of companies on the platform
LOCATION_INFO - user is asking which locations/cities have jobs available
GENERAL_INFO - user is asking what this website/platform is, how it works, what features it has, or general "how do I..." questions
THANKS - user is thanking you
GOODBYE - user is ending the conversation
UNKNOWN - anything that doesn't clearly fit above

Important: questions like "what job types are there", "tell me about job types", "how does this work",
"what can you do" are GENERAL_INFO, NOT JOB_SEARCH.

Return JSON only, no explanation, like {"intent": "JOB_SEARCH"}.

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

  const stripWords = [
    "job", "jobs", "in", "at", "for", "show", "me", "find", "search",
    "openings", "opening", "role", "roles", "available", "position", "positions",
    "hiring", "want", "need", "looking", "currently", "now", "please", "kindly",
    "ok", "okay", "can", "you", "is", "there", "any", "the", "a", "an",
    ...(found.location ? [found.location.toLowerCase()] : []),
    ...(found.company ? [found.company.toLowerCase()] : []),
  ];
  const titleGuess = msg.split(/\s+/).filter(w => w && !stripWords.includes(w)).join(" ").trim();
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

  if (q.includes("job") || q.includes("hiring") || q.includes("opening") || q.includes("vacan") || q.includes("type")) {
    const recentJobs = await Job.find()
      .populate("company", "name")
      .select("title location Salary jobtype experience")
      .sort({ createdAt: -1 })
      .limit(10);
    const jobList = recentJobs
      .map(j => `${j.title} at ${j.company?.name || "Unknown"} — ${j.location}, ₹${j.Salary}, ${j.jobtype}, ${j.experience} yrs exp`)
      .join("\n");
    parts.push(`Recent job openings:\n${jobList || "No jobs posted yet"}`);

    const jobTypes = await Job.distinct("jobtype");
    parts.push(`Job types available: ${jobTypes.filter(Boolean).join(", ") || "None listed"}`);
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
    console.error("getWebsiteAnswer error:", err);
    return "I'm having trouble connecting right now — please try again in a moment.";
  }
};