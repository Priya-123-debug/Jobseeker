import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import FilterCard from "./FilterCard";
import Job from "./Job";
import JobSkeleton from "./JobSkeleton";
import { useSelector } from "react-redux";
import useGetAllJobs from "../hooks/usegetAlljobs";

function Jobs() {
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [activeKeyword, setActiveKeyword] = useState("");

  const { allJobs, filters } = useSelector((state) => state.job);

  // live, debounced search — fires automatically as user types or clears the box
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveKeyword(searchInput.trim());
      setCurrentPage(1);
    }, 400); // 400ms debounce so it doesn't fire on every keystroke

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { totalPages, loading } = useGetAllJobs({
    page: currentPage,
    location: filters.location || "",
    company: filters.company || "",
    minSalary: filters.minSalary || 0,
    maxSalary: filters.maxSalary || 0,
    keyword: activeKeyword,
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setActiveKeyword(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput("");
    setActiveKeyword("");
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by job title, company, or keyword..."
                className="w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-sm"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters((p) => !p)}
              className="md:hidden flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>
          {activeKeyword && (
            <p className="text-xs text-gray-500 mt-2">
              Showing results for <span className="font-semibold text-gray-700">"{activeKeyword}"</span>
            </p>
          )}
        </form>

        <div className="flex flex-col md:flex-row gap-6">
          <div className={`${showFilters ? "block" : "hidden"} md:block md:w-1/4`}>
            <div className="sticky top-20"><FilterCard /></div>
          </div>

          <div className="w-full md:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => <JobSkeleton key={i} />)}
              </div>
            ) : allJobs.length === 0 ? (
              <div className="text-center text-gray-500 mt-16 bg-white rounded-2xl border border-gray-100 py-16">
                <span className="text-4xl mb-3 block">🔍</span>
                <h2 className="text-lg font-semibold text-gray-700">No jobs found</h2>
                <p className="text-sm mt-2">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">{allJobs.length} jobs found</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {allJobs.map((job) => <Job key={job._id} job={job} />)}
                </div>
              </>
            )}
          </div>
        </div>

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8 mb-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl disabled:bg-gray-200 disabled:text-gray-400 transition"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl disabled:bg-gray-200 disabled:text-gray-400 transition"
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