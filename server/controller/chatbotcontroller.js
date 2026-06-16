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

const chatbotcontroller = async (req, res) => {
  const { sessionId, message, action } = req.body;

  // 1️⃣ Close chat
  if (action === "close") {
    deleteSession(sessionId);
    return res.json({
      success: true,
      message: "Chat cleared"
    });
  }

  if (!sessionId || !message) {
    return res.status(400).json({
      success: false,
      message: "SessionId and message required"
    });
  }

  // 2️⃣ Create / Get session
  createSession(sessionId);
  const session = getSession(sessionId);

  if (!session.context)
    session.context = {};

  // 3️⃣ Detect intent
  let intent = localIntent(message);

  if (intent === "UNKNOWN") {
    try {
      const ai = await getIntentFromGemini(message);
      intent = ai.intent || "UNKNOWN";
    } catch (err) {
      console.error("Gemini error:", err);
      intent = "UNKNOWN";
    }
  }

  let reply = "Sorry, I didn't understand.";

  // 4️⃣ Intent logic
  switch (intent) {

    case "GREETING":
      reply = "Hello! How can I assist you today?";
      break;

    case "JOB_SEARCH":
      if (!session.context.jobType) {
        reply = "What type of job are you looking for?";
        session.currentStep = "ASK_JOB_TYPE";
      }
      break;

    case "JOB_STATUS":
      if (!session.context.jobType) {
        reply = "Which job are you asking about?";
        session.currentStep = "ASK_JOB_TYPE";
      } else {
        reply =
          `Checking status for your ${session.context.jobType} job...`;
        session.currentStep = "DONE";
      }
      break;

    case "GOODBYE":
      reply = "Goodbye! Have a great day 😊";
      deleteSession(sessionId);
      break;

    default:
      // ⭐ WEBSITE KNOWLEDGE AI FALLBACK
      try {
        reply = await getWebsiteAnswer(message);
      } catch (err) {
        console.error("AI fallback error:", err);
        reply =
          "Sorry, I couldn't fetch information from portal.";
      }
      break;
  }

  // 5️⃣ Handle multi-step flow
  if (session.currentStep === "ASK_JOB_TYPE") {
    session.context.jobType = message;

    reply =
      `Got it! Searching ${message} jobs for you...`;

    session.currentStep = "DONE";
  }

  // 6️⃣ Save session
  updateSession(sessionId, session);

  // 7️⃣ Send response
  return res.json({
    success: true,
    message: reply,
    context: session.context,
    currentStep: session.currentStep
  });
};

export default chatbotcontroller;
