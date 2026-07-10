import React from "react";
import { useNavigate } from "react-router-dom";
import BookmarkButton from "./BookmarkButton";

const timeAgo = (date) => {
  if (!date) return "Recently";
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

function Job({ job }) {
  const navigate = useNavigate();
  if (!job) return null;

  return (
    <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition p-4 sm:p-5 flex flex-col justify-between h-full">

      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex gap-3 sm:gap-4 min-w-0">

          {/* Logo */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center border rounded-lg bg-gray-50">
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

          {/* Title & Company */}
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
              {job.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {job.company?.name || "Unknown Company"} • {job.location || "Remote"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Posted Time */}
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {timeAgo(job.createdAt)}
          </span>
          <BookmarkButton jobId={job._id} />
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mt-3 sm:mt-4 line-clamp-2 sm:line-clamp-3">
        {job.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
          {job.jobtype}
        </span>
        <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
          {job.position}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-4 sm:mt-5 flex items-center justify-between gap-2">
        <span className="font-semibold text-indigo-600 text-sm sm:text-base truncate">
          ₹{job.Salary?.toLocaleString("en-IN") || "Not disclosed"}
        </span>

        <button
          onClick={() => navigate(`/description/${job._id}`)}
          className="bg-indigo-600 text-white px-4 py-1.5 rounded-md text-xs sm:text-sm hover:bg-indigo-700 active:scale-95 transition flex-shrink-0"
        >
          Details
        </button>
      </div>
    </div>
  );
}

export default Job;