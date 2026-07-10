import {
  createSession,
  getSession,
  deleteSession,
  updateSession
} from "../contextStore/Session.js";

import {
  getIntentFromGemini,
  getWebsiteAnswer,
  getKnownEntities,
  extractEntities
} from "../Service/geminiservice.js";

import Job from "../Model/jobmodel.js";

const localIntent = (msg) => {
  const words = msg.toLowerCase().split(/[^a-z]+/).filter(Boolean);

  if (words.includes("hi") || words.includes("hello") || words.includes("hey"))
    return "GREETING";
  if (words.includes("thanks") || words.includes("thank") || words.includes("thankyou"))
    return "THANKS";
  if (words.includes("bye") || words.includes("goodbye"))
    return "GOODBYE";
  if (words.includes("status"))
    return "JOB_STATUS";
  if (words.includes("job") || words.includes("jobs") || words.includes("vacancy") || words.includes("opening"))
    return "JOB_SEARCH";
  if (words.includes("company") || words.includes("companies"))
    return "COMPANY_INFO";

  return "UNKNOWN";
};

// ⭐ Dynamic multi-filter search — location, company, and/or title, any combo
const searchJobs = async ({ title, location, company: companyName }) => {
  const conditions = {};
  if (title) conditions.title = { $regex: title, $options: "i" };
  if (location) conditions.location = { $regex: location, $options: "i" };

  let query = Job.find(conditions).populate("company", "name").select("title location Salary jobtype").limit(5);
  let jobs = await query;

  if (companyName) {
    jobs = jobs.filter(j => j.company?.name?.toLowerCase().includes(companyName.toLowerCase()));
  }

  if (jobs.length === 0) {
    const criteria = [title && `"${title}"`, location && `in ${location}`, companyName && `at ${companyName}`].filter(Boolean).join(" ");
    return `I couldn't find any current openings ${criteria || "matching that"}. Try different terms?`;
  }

  const list = jobs
    .map(j => `• ${j.title} at ${j.company?.name || "Unknown"} (${j.location}, ₹${j.Salary?.toLocaleString("en-IN")})`)
    .join("\n");
  return `Here's what I found:\n${list}`;
};

const chatbotcontroller = async (req, res) => {
  const { sessionId, message, action } = req.body;

  if (action === "close") {
    deleteSession(sessionId);
    return res.json({ success: true, message: "Chat cleared" });
  }

  if (!sessionId || !message) {
    return res.status(400).json({ success: false, message: "SessionId and message required" });
  }

  createSession(sessionId);
  const session = getSession(sessionId);
  if (!session.context) session.context = {};

  let reply;

  try {
    // ⭐ Every message: check live DB vocabulary + extract real entities from it
    const known = await getKnownEntities();
    const entities = extractEntities(message, known);

    if (session.currentStep === "ASK_JOB_TYPE") {
      // Follow-up answer to "what type of job?" — combine with any earlier filters
      const combined = { ...session.context, title: message.trim() };
      session.context = combined;
      reply = await searchJobs(combined);
      session.currentStep = "DONE";
    } else {
      let intent = localIntent(message);

      if (intent === "UNKNOWN") {
        try {
          const ai = await getIntentFromGemini(message);
          intent = ai.intent || "UNKNOWN";
        } catch (err) {
          console.error("Gemini intent error:", err);
          intent = "UNKNOWN";
        }
      }

      switch (intent) {
        case "GREETING":
          reply = "Hello! How can I assist you today?";
          break;

        case "THANKS":
          reply = "You're welcome! Anything else I can help with?";
          break;

        case "JOB_SEARCH": {
          // If the message itself already contains a real location/company/title, search immediately
          const hasSomething = entities.location || entities.company || entities.titleHint;
          if (hasSomething) {
            session.context = { title: entities.titleHint, location: entities.location, company: entities.company };
            reply = await searchJobs(session.context);
            session.currentStep = "DONE";
          } else {
            reply = "What type of job are you looking for?";
            session.currentStep = "ASK_JOB_TYPE";
          }
          break;
        }

        case "COMPANY_INFO":
          if (entities.company) {
            const jobs = await Job.find({}).populate("company", "name").select("title location company");
            const atCompany = jobs.filter(j => j.company?.name?.toLowerCase() === entities.company.toLowerCase());
            reply = atCompany.length
              ? `${entities.company} currently has ${atCompany.length} open role(s): ${atCompany.map(j => j.title).join(", ")}`
              : `I don't see any current openings at ${entities.company}.`;
          } else {
            reply = `We currently have ${known.companies.length} companies on the platform: ${known.companies.slice(0, 15).join(", ")}${known.companies.length > 15 ? "..." : ""}`;
          }
          break;

        case "JOB_STATUS":
          reply = "To check your application status, please make sure you're logged in and visit your 'My Applications' page — I can add live status lookup here once you're ready.";
          break;

        case "GOODBYE":
          reply = "Goodbye! Have a great day 😊";
          deleteSession(sessionId);
          break;

        default:
          try {
            reply = await getWebsiteAnswer(message);
          } catch (err) {
            console.error("AI fallback error:", err);
            reply = "Sorry, I couldn't fetch information from portal.";
          }
          break;
      }
    }
  } catch (err) {
    console.error("Chatbot controller error:", err);
    reply = "Sorry, something went wrong while processing that.";
  }

  updateSession(sessionId, session);

  return res.json({
    success: true,
    message: reply,
    context: session.context,
    currentStep: session.currentStep
  });
};

export default chatbotcontroller;