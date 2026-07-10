import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import JobCard from "./JobCard";
import usegetAlljobs from "../hooks/usegetAlljobs";

function Latestestjob() {
  const { user } = useSelector((state) => state.auth);
  usegetAlljobs();
  const allJobs = useSelector((state) => state.job?.allJobs ?? []);
  const latestJobs = allJobs.slice(0, 6);

  if (!user) {
    return (
      <section className="bg-gray-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            Latest Job Openings
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-2 mb-6">
            Log in to browse the latest opportunities.
          </p>
          <Link
            to="/login"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition"
          >
            Login to view jobs
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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