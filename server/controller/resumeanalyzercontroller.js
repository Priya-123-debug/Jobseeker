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

    //  Check if PDF fetch failed
    if (!pdfResponse.ok) {
      return res.status(400).json({
        success: false,
        message: "Failed to fetch resume from Cloudinary"
      });
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();
    const base64Pdf = Buffer.from(pdfBuffer).toString("base64");

    const prompt = `You are a professional resume analyzer. Analyze this resume against the job description below.
Respond ONLY with valid JSON, no markdown, no extra text.

Example format:
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

    //  Correct syntax for @google/genai package
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",                      //  role is required
          parts: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: base64Pdf
              }
            },
            { text: prompt }                 // text must come AFTER inlineData
          ]
        }
      ]
    });

    //  Correct way to extract text from @google/genai response
    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(500).json({
        success: false,
        message: "Gemini returned empty response"
      });
    }

    // 5. Parse JSON — remove markdown if Gemini wraps it anyway
    const clean = rawText.replace(/```json|```/g, "").trim();

    let analysis;
    try {
      analysis = JSON.parse(clean);
    } catch (parseErr) {
      console.error("JSON parse failed:", clean);
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI response"
      });
    }

    return res.status(200).json({
      success: true,
      analysis
    });

  } catch (err) {
    console.error("Resume analyzer error:", err.message); //  log err.message not full err
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to analyze resume"  // return actual error message
    });
  }
};