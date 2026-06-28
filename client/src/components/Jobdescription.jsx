import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs";
import { setAppliedJobs } from "../redux/appliedJobsSlice";
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from "../utilis/constant";
import ResumeAnalyzer from "./ResumeAnalyzer";
import { useSelector } from "react-redux";

function Jobdescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useGetAppliedJobs();

  const appliedJobs = useSelector((state) => state.appliedJobs.jobs || []);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        setJob(res.data.job);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 text-xl font-semibold">Job not found</p>
          <button
            onClick={() => navigate("/jobs")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const isApplied = appliedJobs.some(
    (app) => app.jobId?.toString() === job._id.toString()
  );

  // ── Apply handler ──
  const handleApply = async () => {
    if (isApplied) return;
    setApplying(true);
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${job._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Applied successfully!");
        const newAppliedJob = {
          _id: job._id,
          jobId: job._id,
          title: job.title,
          location: job.location,
          experience: job.experience,
          Salary: job.Salary,
          company: job.company?.name,
          logo: job.company?.logo,
          status: "pending",
        };
        dispatch(setAppliedJobs([...appliedJobs, newAppliedJob]));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  // ── WhatsApp Share handler ──
  const handleShare = () => {
    const jobUrl = window.location.href;
    const message = `Check out this job: ${job.title} at ${job.company?.name}\n\n${jobUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // ── Copy Link handler ──
  const handleCopyLink = () => {
    const jobUrl = window.location.href;
    navigator.clipboard.writeText(jobUrl)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-4 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </button>

        <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-8">

          {/* ── Header: Logo + Title ── */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 border rounded-xl bg-gray-50 flex items-center justify-center">
              {job.company?.logo ? (
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <span className="text-xs text-gray-400 text-center px-1">No Logo</span>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {job.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {job.company?.name} &bull; {job.location}
              </p>
            </div>
          </div>

          {/* ── Action buttons row: Apply + Share + Copy ── */}
          {/* On desktop: all in one row. On mobile: Apply full width, share buttons below */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">

            {/* Apply button — hidden on mobile (shown at bottom instead) */}
            <button
              onClick={handleApply}
              disabled={isApplied || applying}
              className={`
                hidden sm:inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition flex-shrink-0
                ${isApplied
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : applying
                  ? "bg-orange-300 text-white cursor-wait"
                  : "bg-orange-500 text-white hover:bg-orange-600 active:scale-95"
                }
              `}
            >
              {isApplied ? "✓ Already Applied" : applying ? "Applying..." : "Apply Now"}
            </button>

            {/* Divider — desktop only */}
            <div className="hidden sm:block h-6 w-px bg-gray-200" />

            {/* Share buttons — visible on both mobile and desktop */}
            <div className="flex items-center gap-2">

              {/* WhatsApp Share */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 active:scale-95 text-white text-sm font-semibold rounded-xl transition"
                title="Share on WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="hidden sm:inline">WhatsApp</span>
                <span className="sm:hidden">Share</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 text-sm font-semibold rounded-xl transition"
                title="Copy job link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span className="hidden sm:inline">Copy Link</span>
                <span className="sm:hidden">Copy</span>
              </button>
            </div>
          </div>

          {/* ── Quick-info badges ── */}
          <div className="flex flex-wrap gap-2 mt-5">
            <Badge color="blue" label={job.jobtype} />
            <Badge color="purple" label={`${job.experience} yrs exp`} />
            <Badge color="green" label={`₹${job.Salary?.toLocaleString("en-IN")}`} />
            <Badge color="orange" label={job.position} />
          </div>

          <hr className="my-5" />

          {/* ── Description ── */}
          <Section title="Job Description">
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </Section>

          {/* ── Requirements ── */}
          {job.requirements?.length > 0 && (
            <Section title="Requirements">
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                    <span className="break-words">{req}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
          

          {user?.role === "student" && (
  <Section title="🤖 AI Resume Analyzer">
    <ResumeAnalyzer jobId={job._id} />
  </Section>
)}

          {/* ── Details grid ── */}
          <Section title="Job Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Detail label="Location" value={job.location} />
              <Detail label="Job Type" value={job.jobtype} />
              <Detail label="Experience" value={`${job.experience} years`} />
              <Detail label="Salary" value={`₹${job.Salary?.toLocaleString("en-IN")}`} />
              <Detail label="Position" value={job.position} />
              {job.industry && <Detail label="Industry" value={job.industry} />}
            </div>
          </Section>

          {/* ── Mobile bottom buttons: Apply + Share + Copy ── */}
          <div className="mt-6 sm:hidden flex flex-col gap-3">
            <button
              onClick={handleApply}
              disabled={isApplied || applying}
              className={`
                w-full py-3 rounded-xl font-semibold text-sm transition
                ${isApplied
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : applying
                  ? "bg-orange-300 text-white cursor-wait"
                  : "bg-orange-500 text-white hover:bg-orange-600 active:scale-95"
                }
              `}
            >
              {isApplied ? "✓ Already Applied" : applying ? "Applying..." : "Apply Now"}
            </button>

            {/* Mobile share row */}
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl text-sm font-semibold active:scale-95 transition"
              >
                📱 WhatsApp
              </button>
              <button
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold active:scale-95 transition"
              >
                🔗 Copy Link
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Small helper components ── */
function Badge({ color, label }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[color]}`}>
      {label}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}

export default Jobdescription;