import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs";
import { setAppliedJobs } from "../redux/appliedJobsSlice";
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from "../utilis/constant";

function Jobdescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useGetAppliedJobs();

  const appliedJobs = useSelector((state) => state.appliedJobs.jobs || []);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

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

          {/* ── Header: Logo + Title + Apply button ── */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

            {/* Logo + title block */}
            <div className="flex items-start gap-4">
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
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  {job.title}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {job.company?.name} &bull; {job.location}
                </p>
              </div>
            </div>

            {/* Apply button — right side on desktop, full width on mobile below */}
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

          {/* ── Mobile Apply button (full width at bottom) ── */}
          <div className="mt-6 sm:hidden">
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