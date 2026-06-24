import React from "react";
import { useSelector } from "react-redux";
import Job from "./Job";
import JobSkeleton from "./JobSkeleton"; // ← add this
import usegetAlljobs from "../hooks/usegetAlljobs";

function Browse() {
  const { loading } = usegetAlljobs(); // ← destructure loading
  const allJobs = useSelector((state) => state.job?.allJobs ?? []);

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            All Jobs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Loading..." : `${allJobs.length} job${allJobs.length !== 1 ? "s" : ""} available`}
          </p>
        </div>

        {/* ← show skeleton while loading */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array(6).fill(0).map((_, i) => (
              <JobSkeleton key={i} />
            ))}
          </div>
        ) : allJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border">
            <span className="text-5xl mb-4">🔍</span>
            <p className="text-gray-500 font-medium">No jobs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {allJobs.map((job) => (
              <Job key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Browse;