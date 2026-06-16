import React from "react";
import { useNavigate } from "react-router-dom";

const timeAgo = (date) => {
  if (!date) return "Recently";
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

function JobCard({ job }) {
  const navigate = useNavigate();
  if (!job) return null;

  return (
    <div className="bg-white rounded-xl border shadow-sm p-4 sm:p-6 hover:shadow-lg transition duration-300 flex flex-col justify-between h-full">

      {/* Header */}
      <div className="flex gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 border rounded-lg flex items-center justify-center bg-gray-50">
          {job.company?.logo ? (
            <img
              src={job.company.logo}
              alt={job.company.name}
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
          ) : (
            <span className="text-[10px] text-gray-400 text-center px-1">No Logo</span>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
            {job.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 truncate">
            {job.company?.name || "Unknown Company"} • {job.location || "Remote"}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3 sm:mb-4 text-sm">
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm">
          {job.jobtype || "N/A"}
        </span>
        <span className="font-semibold text-green-600 text-xs sm:text-sm">
          ₹{job.Salary?.toLocaleString("en-IN") || "Not disclosed"}
        </span>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-400 mt-auto gap-2">
        <span className="whitespace-nowrap">{timeAgo(job.createdAt)}</span>

        <button
          onClick={() => navigate(`/description/${job._id}`)}
          className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition whitespace-nowrap"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default JobCard;