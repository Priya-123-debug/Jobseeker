import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Herosec() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const popularSearches = ["React", "Python", "Frontend", "Backend", "Data Science"];

  return (
    <section className="relative bg-gradient-to-br from-purple-900 via-purple-700 to-orange-500 text-white overflow-hidden">
      {/* Background decoration blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400/10 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          500+ new jobs posted this week
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
          Find Your{" "}
          <span className="text-orange-300 underline decoration-wavy decoration-orange-400/50">
            Dream Job
          </span>
          , Today
        </h1>

        {/* Subheadline */}
        <p className="text-sm sm:text-base md:text-lg text-purple-100 mb-8 max-w-2xl mx-auto leading-relaxed">
          Connect with top recruiters, explore thousands of opportunities, and
          kickstart your career in the tech industry.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search jobs, companies, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-800 text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-lg"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-95 rounded-xl font-semibold text-white transition shadow-lg whitespace-nowrap"
          >
            Search Jobs
          </button>
        </form>

        {/* Popular searches */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-purple-200">Popular:</span>
          {popularSearches.map((s) => (
            <button
              key={s}
              onClick={() => { setSearchQuery(s); navigate(`/jobs?keyword=${s}`); }}
              className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1 rounded-full transition"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { value: "10K+", label: "Jobs Posted" },
            { value: "5K+", label: "Companies" },
            { value: "50K+", label: "Job Seekers" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-orange-300">{stat.value}</p>
              <p className="text-xs text-purple-200 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-10 sm:h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80">
          <path fill="#f9fafb" fillOpacity="1"
            d="M0,40L60,45C120,50,240,60,360,58C480,56,600,42,720,37C840,32,960,36,1080,42C1200,48,1320,56,1380,60L1440,64L1440,80L0,80Z" />
        </svg>
      </div>
    </section>
  );
}

export default Herosec;