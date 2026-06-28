import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { RESUME_ANALYZER_API_END_POINT } from "../utilis/constant";

function ResumeAnalyzer({ jobId }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await axios.post(
        `${RESUME_ANALYZER_API_END_POINT}/analyze`,
        { jobId },
        { withCredentials: true }
      );
      if (res.data.success) {
        setAnalysis(res.data.analysis);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to analyze resume"
      );
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score) => {
    if (score >= 75) return "bg-green-50 border-green-200";
    if (score >= 50) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className="mt-4">

      {/* Analyze Button */}
      {!analysis && (
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing Resume...
            </>
          ) : (
            "🤖 Check My Resume Match"
          )}
        </button>
      )}

      {/* Analysis Result */}
      {analysis && (
        <div className="space-y-4">

          {/* Match Score */}
          <div className={`border rounded-xl p-5 ${getScoreBg(analysis.matchScore)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Resume Match Score</p>
                <p className={`text-4xl font-bold mt-1 ${getScoreColor(analysis.matchScore)}`}>
                  {analysis.matchScore}%
                </p>
                <p className="text-sm text-gray-500 mt-1">{analysis.experienceLevel}</p>
              </div>
              <div className="text-5xl">
                {analysis.shouldApply ? "✅" : "⚠️"}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  analysis.matchScore >= 75
                    ? "bg-green-500"
                    : analysis.matchScore >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${analysis.matchScore}%` }}
              />
            </div>

            <p className="text-sm text-gray-600 mt-3 italic">
              "{analysis.summary}"
            </p>
          </div>

          {/* Skills Found */}
          {analysis.skillsFound?.length > 0 && (
            <div className="bg-white border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                ✅ Skills You Have
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.skillsFound.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {analysis.missingSkills?.length > 0 && (
            <div className="bg-white border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                ❌ Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions?.length > 0 && (
            <div className="bg-white border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                💡 Suggestions
              </h3>
              <ul className="space-y-2">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Should Apply Banner */}
          <div className={`rounded-xl p-4 text-center font-semibold text-sm ${
            analysis.shouldApply
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}>
            {analysis.shouldApply
              ? "🎉 Great match! You should apply for this job."
              : "⚠️ You can apply but consider improving missing skills first."}
          </div>

          {/* Analyze Again */}
          <button
            onClick={() => setAnalysis(null)}
            className="text-sm text-indigo-600 hover:underline"
          >
            Analyze Again
          </button>

        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;