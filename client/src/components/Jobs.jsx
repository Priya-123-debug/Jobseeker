import React, { useState } from "react";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import usegetAlljobs from "../hooks/usegetAlljobs";

function Jobs() {
  usegetAlljobs();

  const [showFilters, setShowFilters] = useState(false);

  const { allJobs, filters } = useSelector((state) => state.job);

  const filteredJobs = allJobs.filter((job) => {
    const locationMatch =
      !filters.location ||
      job.location?.toLowerCase().includes(filters.location.toLowerCase());

    const industryMatch =
      !filters.industry ||
      job.industry?.toLowerCase().includes(filters.industry.toLowerCase());

    let salaryMatch = true;

    if (filters.salary === "0 - 5 LPA") {
      salaryMatch = job.Salary >= 0 && job.Salary <= 500000;
    } else if (filters.salary === "5 - 10 LPA") {
      salaryMatch = job.Salary >= 500000 && job.Salary <= 1000000;
    } else if (filters.salary === "10 - 20 LPA") {
      salaryMatch = job.Salary >= 1000000 && job.Salary <= 2000000;
    } else if (filters.salary === "20+ LPA") {
      salaryMatch = job.Salary >= 2000000;
    }

    return locationMatch && industryMatch && salaryMatch;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Mobile Filter Panel */}
        {showFilters && (
          <div className="md:hidden mb-4 bg-white p-4 rounded-xl shadow">
            <FilterCard />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Desktop Sidebar Filter */}
          <div className="hidden md:block md:w-1/4">
            <div className="sticky top-20">
              <FilterCard />
            </div>
          </div>

          {/* Jobs Section */}
          <div className="w-full md:w-3/4">
            {filteredJobs.length === 0 ? (
              <div className="text-center text-gray-500 mt-16">
                <h2 className="text-lg md:text-xl font-semibold">
                  No jobs found
                </h2>
                <p className="text-sm">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {filteredJobs.length} jobs found
                  </p>
                </div>

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {filteredJobs.map((job) => (
                    <Job key={job._id} job={job} />
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Jobs;