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

const infoWords = ["type", "types", "kind", "kinds", "what", "tell", "explain", "list", "how", "does", "work"];

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

  const hasJobWord = words.includes("job") || words.includes("jobs") || words.includes("vacancy") || words.includes("opening");
  const isInfoQuestion = infoWords.some(w => words.includes(w));

  if (hasJobWord && !isInfoQuestion)
    return "JOB_SEARCH";

  if (words.includes("company") || words.includes("companies"))
    return "COMPANY_INFO";

  return "UNKNOWN";
};

// Get up to `limit` distinct job titles currently open, for use as quick-reply buttons
const getJobTitleOptions = async (limit = 8) => {
  const titles = await Job.distinct("title");
  return titles.filter(Boolean).slice(0, limit);
};

// Exact-match search — used when the user clicked a button, so we trust the value fully
const searchJobsExact = async ({ title, location, company: companyName }) => {
  const conditions = {};
  if (title) conditions.title = { $regex: `^${title}$`, $options: "i" };
  if (location) conditions.location = { $regex: location, $options: "i" };

  let jobs = await Job.find(conditions).populate("company", "name").select("title location Salary jobtype").limit(5);

  if (companyName) {
    jobs = jobs.filter(j => j.company?.name?.toLowerCase() === companyName.toLowerCase());
  }

  if (jobs.length === 0) {
    return `No current openings for "${title || "that"}" right now. Want to see something else?`;
  }

  const list = jobs
    .map(j => `• ${j.title} at ${j.company?.name || "Unknown"} (${j.location}, ₹${j.Salary?.toLocaleString("en-IN")})`)
    .join("\n");
  return `Here's what I found:\n${list}`;
};

// Fuzzy word-by-word search — used when the user typed free text, not a button click
const searchJobsFuzzy = async ({ title, location, company: companyName }) => {
  const conditions = {};

  if (title) {
    const titleWords = title.split(/\s+/).filter(Boolean);
    if (titleWords.length) {
      conditions.$and = titleWords.map(w => ({ title: { $regex: w, $options: "i" } }));
    }
  }
  if (location) conditions.location = { $regex: location, $options: "i" };

  let jobs = await Job.find(conditions).populate("company", "name").select("title location Salary jobtype").limit(5);

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
  let options = null; // quick-reply buttons for the frontend to render

  try {
    const known = await getKnownEntities();
    const entities = extractEntities(message, known);

    // ── Step: user is replying after we showed them job title buttons ──
    if (session.currentStep === "ASK_JOB_TYPE") {
      const offered = session.offeredOptions || [];
      const clickedButton = offered.find(o => o.toLowerCase() === message.trim().toLowerCase());

      const combined = { ...session.context, title: message.trim() };
      session.context = combined;

      // If it exactly matches a button we offered, use exact search (guaranteed correct).
      // Otherwise fall back to fuzzy search since they typed something free-form.
      reply = clickedButton
        ? await searchJobsExact(combined)
        : await searchJobsFuzzy(combined);

      session.currentStep = "DONE";
      session.offeredOptions = null;

    } else {
      let intent = localIntent(message);

      if (intent === "UNKNOWN") {
        try {
          const ai = await getIntentFromGemini(message);
          intent = ai.intent || "UNKNOWN";
        } catch (err) {
          console.error("AI intent error:", err);
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
          const hasSomething = entities.location || entities.company || entities.titleHint;
          if (hasSomething) {
            session.context = { title: entities.titleHint, location: entities.location, company: entities.company };
            reply = await searchJobsFuzzy(session.context);
            session.currentStep = "DONE";
          } else {
            // No specifics given — offer real job titles as clickable options instead of open text
            const titleOptions = await getJobTitleOptions();
            if (titleOptions.length) {
              reply = "What type of job are you looking for? Pick one or type your own:";
              options = titleOptions;
              session.offeredOptions = titleOptions;
              session.currentStep = "ASK_JOB_TYPE";
            } else {
              reply = "We don't have any job listings yet — check back soon!";
            }
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
          } else if (known.companies.length) {
            reply = "Here are the companies currently hiring — tap one to see their openings:";
            options = known.companies.slice(0, 10);
          } else {
            reply = "We don't have any companies listed yet.";
          }
          break;

        case "JOB_STATUS":
          reply = "To check your application status, please make sure you're logged in and visit your 'My Applications' page — I can add live status lookup here once you're ready.";
          break;

        case "GOODBYE":
          reply = "Goodbye! Have a great day 😊";
          deleteSession(sessionId);
          break;

        case "GENERAL_INFO":
        case "LOCATION_INFO":
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
    options,
    context: session.context,
    currentStep: session.currentStep
  });
};

export default chatbotcontroller;