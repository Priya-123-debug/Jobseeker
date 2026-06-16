import { GoogleGenAI } from "@google/genai";
import { websiteText } from "../data/website.js";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Intent
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

// Website Knowledge
export const getWebsiteAnswer = async (question) => {
  try {
    const prompt = `
Answer ONLY from website content.

Content:
${websiteText}

Question:
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

  } catch {
    return "AI error.";
  }
};
