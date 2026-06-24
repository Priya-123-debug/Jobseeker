import React, { useState } from "react";
import FilterCard from "./FilterCard";
import Job from "./Job";
import JobSkeleton from "./JobSkeleton"; // ← add this
import { useSelector } from "react-redux";
import useGetAllJobs from "../hooks/usegetAlljobs";

function Jobs() {
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { allJobs, filters } = useSelector((state) => state.job);

  const { totalPages, loading } = useGetAllJobs({ // ← destructure loading
    page: currentPage,
    location: filters.location || "",
    industry: filters.industry || "",
    minSalary: filters.minSalary || 0,
    maxSalary: filters.maxSalary || 0
  });

  return (
    <div className="bg-gray-50 min-h-screen py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">

        <div className="flex flex-col md:flex-row gap-6">
          <div className="hidden md:block md:w-1/4">
            <div className="sticky top-20"><FilterCard /></div>
          </div>

          <div className="w-full md:w-3/4">
            {/* ← Show skeleton while loading */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <JobSkeleton key={i} />
                ))}
              </div>
            ) : allJobs.length === 0 ? (
              <div className="text-center text-gray-500 mt-16">
                <h2 className="text-lg font-semibold">No jobs found</h2>
                <p className="text-sm mt-2">Try changing your filters</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">{allJobs.length} jobs found</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {allJobs.map((job) => (
                    <Job key={job._id} job={job} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Pagination */}
        {!loading && (
          <div className="flex items-center justify-center gap-4 mt-8 mb-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-300"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Jobs;