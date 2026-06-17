import React, { useState } from "react";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import useGetAllJobs from "../hooks/usegetAlljobs"; // Ensure import matches

function Jobs() {
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Select filter state from Redux
  const { allJobs, filters } = useSelector((state) => state.job);

  // Pass all dependencies to the hook. 
  // It will re-run automatically when any of these change.
  const totalPages = useGetAllJobs({ 
    page: currentPage, 
    location: filters.location || "", 
    industry: filters.industry || "",
    // Note: Assuming your filter object handles salary logic or you need to parse it
    minSalary: filters.minSalary || 0, 
    maxSalary: filters.maxSalary || 0 
  });

  return (
    <div className="bg-gray-50 min-h-screen py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        
        {/* Mobile Filter Button/Panel remains the same */}
        {/* ... */}

        <div className="flex flex-col md:flex-row gap-6">
          <div className="hidden md:block md:w-1/4">
            <div className="sticky top-20"><FilterCard /></div>
          </div>

          <div className="w-full md:w-3/4">
            {allJobs.length === 0 ? (
              <div className="text-center text-gray-500 mt-16">
                <h2 className="text-lg font-semibold">No jobs found</h2>
              </div>
            ) : (
              <>
                <div className="mb-4"><p className="text-sm text-gray-600">{allJobs.length} jobs found</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {allJobs.map((job) => (
                    <Job key={job._id} job={job} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Pagination controls */}
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
      </div>
    </div>
  );
}

export default Jobs;