import {
  createSession,
  getSession,
  deleteSession,
  updateSession
} from "../contextStore/Session.js";

import {
  getIntentFromGemini,
  getWebsiteAnswer
} from "../Service/geminiservice.js";

import Job from "../Model/jobmodel.js";

// Local intent fallback
const localIntent = (msg) => {
  msg = msg.toLowerCase();

  if (msg.includes("hi") || msg.includes("hello"))
    return "GREETING";

  if (msg.includes("job"))
    return "JOB_SEARCH";

  if (msg.includes("status"))
    return "JOB_STATUS";

  if (msg.includes("bye"))
    return "GOODBYE";

  return "UNKNOWN";
};

// ⭐ Real DB-backed job search
const searchJobsByType = async (jobType) => {
  const matchingJobs = await Job.find({
    title: { $regex: jobType, $options: "i" },
  })
    .populate("company", "name")
    .select("title location Salary jobtype")
    .limit(5);

  if (matchingJobs.length === 0) {
    return `I couldn't find any current openings for "${jobType}". Try another role?`;
  }

  const list = matchingJobs
    .map(j => `• ${j.title} at ${j.company?.name || "Unknown company"} (${j.location}, ₹${j.Salary?.toLocaleString("en-IN")})`)
    .join("\n");

  return `Here are some ${jobType} openings I found:\n${list}`;
};

const chatbotcontroller = async (req, res) => {
  const { sessionId, message, action } = req.body;

  if (action === "close") {
    deleteSession(sessionId);
    return res.json({ success: true, message: "Chat cleared" });
  }

  if (!sessionId || !message) {
    return res.status(400).json({
      success: false,
      message: "SessionId and message required"
    });
  }

  createSession(sessionId);
  const session = getSession(sessionId);

  if (!session.context)
    session.context = {};

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

  let reply = "Sorry, I didn't understand.";

  try {
    switch (intent) {

      case "GREETING":
        reply = "Hello! How can I assist you today?";
        break;

      case "JOB_SEARCH":
        if (!session.context.jobType) {
          reply = "What type of job are you looking for?";
          session.currentStep = "ASK_JOB_TYPE";
        } else {
          reply = await searchJobsByType(session.context.jobType);
          session.currentStep = "DONE";
        }
        break;

      case "JOB_STATUS":
        if (!session.context.jobType) {
          reply = "Which job are you asking about?";
          session.currentStep = "ASK_JOB_TYPE";
        } else {
          reply = `Checking status for your ${session.context.jobType} job...`;
          session.currentStep = "DONE";
        }
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

    if (session.currentStep === "ASK_JOB_TYPE") {
      session.context.jobType = message;
      reply = await searchJobsByType(message);
      session.currentStep = "DONE";
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