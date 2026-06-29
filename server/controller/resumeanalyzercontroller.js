import Groq from "groq-sdk";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import User from "../Model/usermodel.js";
import Job from "../Model/jobmodel.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const extractTextFromPdf = async (buffer) => {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
    const pdf = await loadingTask.promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      fullText += content.items.map(item => item.str).join(" ") + "\n";
    }
    console.log("Extracted text preview:", fullText.slice(0, 300));
    return fullText.trim();
  } catch (err) {
    console.error("PDF parse error:", err.message);
    return "";
  }
};

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
    if (!pdfResponse.ok) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch resume from Cloudinary"
      });
    }
    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());

    // 4. Extract text properly using pdfjs-dist
    const resumeText = await extractTextFromPdf(pdfBuffer);
    console.log("Resume text length:", resumeText.length);

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from resume. Please re-upload a text-based PDF."
      });
    }

    // 5. Send to Groq AI
    const prompt = `You are a professional ATS resume analyzer. Analyze the resume against the job description below.
Respond ONLY with a valid JSON object — no markdown, no explanation, no extra text.

Required JSON shape:
{
  "matchScore": <number 0-100>,
  "skillsFound": [<skills present in resume that match job requirements>],
  "missingSkills": [<required skills not found in resume>],
  "experienceLevel": "<Fresher | Junior | Mid Level | Senior>",
  "suggestions": [<2-4 actionable improvement tips>],
  "shouldApply": <true | false>,
  "summary": "<2-3 sentence honest assessment>"
}

Job Title: ${job.title}
Required Skills: ${job.requirements.join(", ")}
Job Description: ${job.description}
Experience Required: ${job.experience} years

Resume:
${resumeText.slice(0, 4000)}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
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

    // 6. Safely extract JSON even if model wraps in markdown
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", rawText);
      return res.status(500).json({
        success: false,
        message: "AI response was not valid JSON"
      });
    }

    const analysis = JSON.parse(jsonMatch[0]);

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