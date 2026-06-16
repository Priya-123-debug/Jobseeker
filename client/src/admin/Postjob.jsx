import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { JOB_API_END_POINT } from "../utilis/constant";

function Postjob() {
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    Salary: "",
    location: "",
    jobtype: "",
    industry: "",
    experience: "",
    position: "",
    company: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, formData, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Job posted successfully!");
        navigate("/admin/jobs");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error posting job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-5 sm:p-8">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-4 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Post a Job</h2>
          <p className="text-sm text-gray-500 mb-6">
            Fill in the details below to publish a new job listing
          </p>

          {companies.length === 0 ? (
            <div className="text-center py-10 bg-orange-50 border border-orange-200 rounded-xl">
              <p className="text-orange-600 font-semibold mb-3">
                You need to register a company first
              </p>
              <button
                onClick={() => navigate("/admin/companies/create")}
                className="px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition"
              >
                Register Company
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Title */}
              <Field label="Job Title">
                <input
                  type="text" name="title" placeholder="e.g. Frontend Developer"
                  onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </Field>

              {/* Description */}
              <Field label="Description">
                <textarea
                  name="description" placeholder="Describe the role, responsibilities..."
                  onChange={handleChange} required rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
                />
              </Field>

              {/* Requirements */}
              <Field label="Requirements (comma separated)">
                <input
                  type="text" name="requirements" placeholder="e.g. React, Node.js, MongoDB"
                  onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </Field>

              {/* Two-column on desktop, stacked on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Salary (₹ per annum)">
                  <input
                    type="number" name="Salary" placeholder="e.g. 600000"
                    onChange={handleChange} required
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  />
                </Field>

                <Field label="Location">
                  <input
                    type="text" name="location" placeholder="e.g. Bangalore"
                    onChange={handleChange} required
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  />
                </Field>

                <Field label="Job Type">
                  <input
                    type="text" name="jobtype" placeholder="e.g. Full-time"
                    onChange={handleChange} required
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  />
                </Field>

                <Field label="Industry">
                  <input
                    type="text" name="industry" placeholder="e.g. IT, Finance, Design"
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  />
                </Field>

                <Field label="Experience (years)">
                  <input
                    type="number" name="experience" placeholder="e.g. 2"
                    onChange={handleChange} required
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  />
                </Field>

                <Field label="Open Positions">
                  <input
                    type="text" name="position" placeholder="e.g. 3"
                    onChange={handleChange} required
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  />
                </Field>
              </div>

              {/* Company Select */}
              <Field label="Company">
                <select
                  name="company" onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white"
                >
                  <option value="">Select Company</option>
                  {companies.map((comp) => (
                    <option key={comp._id} value={comp._id}>{comp.name}</option>
                  ))}
                </select>
              </Field>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-white transition active:scale-95 ${
                  loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? "Posting..." : "Post Job"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default Postjob;