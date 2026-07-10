import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, X } from "lucide-react";
import { setFilters as setJobFilters } from "../redux/jobSlice";
import useGetFilterOptions from "../hooks/useGetFilterOptions";

const SALARY_BUCKETS = [
  { label: "0 - 5 LPA", min: 0, max: 500000 },
  { label: "5 - 10 LPA", min: 500000, max: 1000000 },
  { label: "10 - 20 LPA", min: 1000000, max: 2000000 },
  { label: "20+ LPA", min: 2000000, max: 100000000 },
];

function FilterSection({ title, options, name, selected, onChange, search, onSearchChange }) {
  const filtered = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(search.toLowerCase())),
    [options, search]
  );

  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-0">
      <h3 className="text-sm font-semibold text-gray-800 mb-2.5">{title}</h3>

      {options.length > 5 && (
        <div className="relative mb-2.5">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
          />
        </div>
      )}

      <div className="max-h-44 overflow-y-auto pr-1 space-y-0.5">
        {filtered.length === 0 ? (
          <p className="text-xs text-gray-400 py-1">No matches</p>
        ) : (
          filtered.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer py-1 px-1.5 rounded-md hover:bg-gray-50 transition"
            >
              <input
                type="radio"
                name={name}
                value={opt}
                checked={selected === opt}
                onChange={onChange}
                className="accent-indigo-600 w-3.5 h-3.5"
              />
              {opt}
            </label>
          ))
        )}
      </div>
    </div>
  );
}

function FilterCard() {
  const dispatch = useDispatch();
  const reduxFilters = useSelector((state) => state.job.filters);
  const { locations, industries, loading } = useGetFilterOptions();

  const [filters, setFilters] = useState({
    location: reduxFilters.location || "",
    industry: reduxFilters.industry || "",
    salary: reduxFilters.salary || "",
  });

  const [locationSearch, setLocationSearch] = useState("");
  const [industrySearch, setIndustrySearch] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isDeselecting = filters[name] === value;
    const newValue = isDeselecting ? "" : value;

    const updated = { ...filters, [name]: newValue };

    if (name === "salary") {
      const bucket = SALARY_BUCKETS.find((b) => b.label === newValue);
      updated.minSalary = bucket ? bucket.min : 0;
      updated.maxSalary = bucket ? bucket.max : 0;
    }

    setFilters(updated);
    dispatch(setJobFilters(updated));
  };

  const handleClear = () => {
    const reset = { location: "", industry: "", salary: "", minSalary: 0, maxSalary: 0 };
    setFilters(reset);
    setLocationSearch("");
    setIndustrySearch("");
    dispatch(setJobFilters(reset));
  };

  const activeCount = [filters.location, filters.industry, filters.salary].filter(Boolean).length;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-pulse space-y-4">
        <div className="h-4 bg-gray-100 rounded w-1/3" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-gray-100 rounded w-1/4" />
            <div className="h-8 bg-gray-50 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-800">Filters</h2>
        {activeCount > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-xs text-red-500 font-semibold hover:underline"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      <FilterSection
        title="Location"
        options={locations}
        name="location"
        selected={filters.location}
        onChange={handleChange}
        search={locationSearch}
        onSearchChange={setLocationSearch}
      />

      <FilterSection
        title="Industry"
        options={industries}
        name="industry"
        selected={filters.industry}
        onChange={handleChange}
        search={industrySearch}
        onSearchChange={setIndustrySearch}
      />

      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-2.5">Salary Range</h3>
        <div className="space-y-0.5">
          {SALARY_BUCKETS.map((b) => (
            <label
              key={b.label}
              className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer py-1 px-1.5 rounded-md hover:bg-gray-50 transition"
            >
              <input
                type="radio"
                name="salary"
                value={b.label}
                checked={filters.salary === b.label}
                onChange={handleChange}
                className="accent-indigo-600 w-3.5 h-3.5"
              />
              {b.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterCard;