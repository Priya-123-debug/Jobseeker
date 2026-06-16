import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetAllAdminjobs from "../hooks/useGetAllAdminjobs";

function Adminjobtable() {
  useGetAllAdminjobs();
  const navigate = useNavigate();
  const { allAdminjobs } = useSelector((store) => store.job);
  const { searchCompanybytext } = useSelector((store) => store.company);
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    if (!allAdminjobs || allAdminjobs.length === 0) {
      setFilteredJobs([]);
      return;
    }
    const filtered = allAdminjobs.filter((job) => {
      if (!searchCompanybytext) return true;
      return job?.company?.name?.toLowerCase().includes(searchCompanybytext.toLowerCase());
    });
    setFilteredJobs(filtered);
  }, [allAdminjobs, searchCompanybytext]);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A";

  if (filteredJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border">
        <span className="text-4xl mb-3">📋</span>
        <p className="text-gray-500 font-medium">No jobs found</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop table ── */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-2xl border shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredJobs.map((job) => (
              <tr key={job._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium text-gray-800">{job.company?.name || "N/A"}</td>
                <td className="px-4 py-3 text-gray-600">{job.title}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(job.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/jobs/${job._id}`)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                      className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-xs font-medium transition"
                    >
                      Applicants
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <div className="md:hidden space-y-3">
        {filteredJobs.map((job) => (
          <div key={job._id} className="bg-white rounded-xl border p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 truncate">{job.title}</p>
                <p className="text-sm text-gray-500 truncate">{job.company?.name || "N/A"}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(job.createdAt)}</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => navigate(`/admin/jobs/${job._id}`)}
                className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium active:scale-95 transition"
              >
                Edit
              </button>
              <button
                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg text-xs font-medium active:scale-95 transition"
              >
                Applicants
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Adminjobtable;