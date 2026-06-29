import User from "../Model/usermodel.js";
import Job from "../Model/jobmodel.js";

export const analyzeResume = async (req, res) => {
  try {
    const userId = req.id;
    const { jobId } = req.body;

    const user = await User.findById(userId);
    if (!user?.profile?.resume) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume first in your profile"
      });
    }

    const job = await Job.findById(jobId).populate("company", "name");
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // Fetch resume PDF
    const pdfResponse = await fetch(user.profile.resume);
    const pdfBuffer = await pdfResponse.arrayBuffer();
    const base64Pdf = Buffer.from(pdfBuffer).toString("base64");

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

    // Use REST API directly — most stable approach
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: "application/pdf",
                    data: base64Pdf
                  }
                },
                { text: prompt }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("Gemini response:", JSON.stringify(data));

    if (data.error) {
      return res.status(500).json({
        success: false,
        message: data.error.message
      });
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
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