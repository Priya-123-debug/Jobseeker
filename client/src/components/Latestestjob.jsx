import React from "react";
import { useSelector } from "react-redux";
import JobCard from "./JobCard";
import usegetAlljobs from "../hooks/usegetAlljobs";

function Latestestjob() {
  usegetAlljobs();
  const allJobs = useSelector((state) => state.job?.allJobs ?? []);
  const latestJobs = allJobs.slice(0, 6);

  return (
    <section className="bg-gray-50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            Latest Job Openings
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-2">
            Explore recently posted jobs from top companies
          </p>
        </div>

        {latestJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border">
            <span className="text-4xl mb-3">📭</span>
            <p className="text-gray-500">No jobs available right now</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {latestJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Latestestjob;