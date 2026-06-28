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

    console.log("userId:", userId);
    console.log("jobId:", jobId);

    const user = await User.findById(userId);
    if (!user?.profile?.resume) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume first in your profile"
      });
    }

    console.log("resume url:", user.profile.resume);

    const job = await Job.findById(jobId).populate("company", "name");
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    let base64Pdf;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const pdfResponse = await fetch(user.profile.resume, {
        signal: controller.signal,
        headers: {
          "Accept": "application/pdf,*/*",
          "User-Agent": "Mozilla/5.0"
        }
      });

      clearTimeout(timeout);

      console.log("PDF fetch status:", pdfResponse.status);

      if (!pdfResponse.ok) {
        throw new Error(`PDF fetch failed: ${pdfResponse.status}`);
      }

      const pdfBuffer = await pdfResponse.arrayBuffer();
      base64Pdf = Buffer.from(pdfBuffer).toString("base64");

      console.log("base64 length:", base64Pdf.length);

    } catch (fetchErr) {
      console.error("PDF fetch error:", fetchErr.message);

      const fixedUrl = user.profile.resume
        .replace("/image/upload/", "/raw/upload/")
        .replace("/auto/upload/", "/raw/upload/");

      console.log("trying fixed URL:", fixedUrl);

      const retryResponse = await fetch(fixedUrl, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      if (!retryResponse.ok) {
        return res.status(400).json({
          success: false,
          message: "Could not fetch resume. Please re-upload your resume from your profile."
        });
      }

      const pdfBuffer = await retryResponse.arrayBuffer();
      base64Pdf = Buffer.from(pdfBuffer).toString("base64");
    }

    if (!base64Pdf || base64Pdf.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is empty. Please re-upload your resume."
      });
    }

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

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: base64Pdf
              }
            },
            { text: prompt }
          ]
        }
      ]
    });

    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("Gemini raw response:", rawText);

    if (!rawText) {
      return res.status(500).json({
        success: false,
        message: "Gemini returned empty response"
      });
    }

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
    console.error("Resume analyzer error:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to analyze resume"
    });
  }
};