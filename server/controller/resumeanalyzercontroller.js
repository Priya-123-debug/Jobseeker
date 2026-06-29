import Groq from "groq-sdk";
import pdfParse from "pdf-parse";
import User from "../Model/usermodel.js";
import Job from "../Model/jobmodel.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
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

    // 3. Fetch PDF from Cloudinary
    const pdfResponse = await fetch(user.profile.resume);
    const pdfBuffer = await pdfResponse.arrayBuffer();
    const buffer = Buffer.from(pdfBuffer);

    // 4. Extract text from PDF
    const pdfData = await pdfParse(buffer);
    const resumeText = pdfData.text;

    console.log("Resume text length:", resumeText.length);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from resume. Please re-upload your resume."
      });
    }

    // 5. Send to Groq AI
    const prompt = `You are a professional resume analyzer. Analyze this resume against the job description.
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

Resume Text:
${resumeText.slice(0, 3000)}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const rawText = completion.choices[0]?.message?.content;
    console.log("Groq response:", rawText);

    if (!rawText) {
      return res.status(500).json({
        success: false,
        message: "AI returned empty response"
      });
    }

    // 6. Parse JSON
    const clean = rawText.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(clean);

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