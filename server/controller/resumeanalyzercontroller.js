import { GoogleGenAI } from "@google/genai";
import User from "../Model/usermodel.js";
import Job from "../Model/jobmodel.js";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const analyzeResume = async (req, res) => {
  try {
    const userId = req.id;
    const { jobId } = req.body;

    // 1. Get user with resume
    const user = await User.findById(userId);
    if (!user?.profile?.resume) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume first in your profile"
      });
    }

    // 2. Get job details
    const job = await Job.findById(jobId).populate("company", "name");
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // 3. Fetch resume PDF from Cloudinary as base64
    const pdfResponse = await fetch(user.profile.resume);
    const pdfBuffer = await pdfResponse.arrayBuffer();
    const base64Pdf = Buffer.from(pdfBuffer).toString("base64");

    // 4. Send to Gemini AI with PDF
    const prompt = `You are a professional resume analyzer. Analyze this resume against the job description below.
Respond ONLY with valid JSON, no markdown, no extra text.

{
  "matchScore": 85,
  "skillsFound": ["React", "Node.js", "MongoDB"],
  "missingSkills": ["TypeScript", "Docker"],
  "experienceLevel": "Mid Level",
  "suggestions": ["Add more project details", "Mention team size"],
  "shouldApply": true,
  "summary": "Strong candidate with good frontend skills"
}

Job Title: ${job.title}
Job Requirements: ${job.requirements.join(", ")}
Job Description: ${job.description}
Experience Required: ${job.experience} years
`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: base64Pdf
              }
            }
          ]
        }
      ]
    });

    const rawText =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // 5. Parse JSON
    const clean = rawText.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(clean);

    return res.status(200).json({
      success: true,
      analysis
    });

  } catch (err) {
    console.error("Resume analyzer error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to analyze resume"
    });
  }
};