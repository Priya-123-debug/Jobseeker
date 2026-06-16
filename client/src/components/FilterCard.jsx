import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters as setJobFilters } from "../redux/jobSlice";

const LOCATIONS = ["Bangalore", "Hyderabad", "Pune", "Mumbai", "Delhi", "Remote"];
const INDUSTRIES = ["IT", "Design", "Finance", "Marketing", "Healthcare", "Education"];
const SALARIES = ["0 - 5 LPA", "5 - 10 LPA", "10 - 20 LPA", "20+ LPA"];

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function FilterCard() {
  const dispatch = useDispatch();
  const reduxFilters = useSelector((state) => state.job.filters);

  const [filters, setFilters] = useState({
    location: reduxFilters.location || "",
    industry: reduxFilters.industry || "",
    salary: reduxFilters.salary || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // clicking the same radio again = deselect (toggle off)
    const newValue = filters[name] === value ? "" : value;

    const updated = { ...filters, [name]: newValue };
    setFilters(updated);
    dispatch(setJobFilters(updated));
  };

  const handleClear = () => {
    const reset = { location: "", industry: "", salary: "" };
    setFilters(reset);
    dispatch(setJobFilters(reset));
  };

  const activeCount = [filters.location, filters.industry, filters.salary].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          <h2 className="text-base font-bold text-gray-800">Filters</h2>
          {activeCount > 0 && (
            <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-red-500 font-semibold hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Location */}
      <FilterSection title="Location">
        {LOCATIONS.map((loc) => (
          <label
            key={loc}
            className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer group"
          >
            <input
              type="radio"
              name="location"
              value={loc}
              checked={filters.location === loc}
              onChange={handleChange}
              onClick={handleChange}
              className="accent-indigo-600 w-4 h-4 cursor-pointer"
            />
            <span className="group-hover:text-indigo-600 transition-colors">
              {loc}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Industry */}
      <FilterSection title="Industry">
        {INDUSTRIES.map((ind) => (
          <label
            key={ind}
            className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer group"
          >
            <input
              type="radio"
              name="industry"
              value={ind}
              checked={filters.industry === ind}
              onChange={handleChange}
              onClick={handleChange}
              className="accent-indigo-600 w-4 h-4 cursor-pointer"
            />
            <span className="group-hover:text-indigo-600 transition-colors">
              {ind}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Salary */}
      <FilterSection title="Salary Range">
        {SALARIES.map((range) => (
          <label
            key={range}
            className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer group"
          >
            <input
              type="radio"
              name="salary"
              value={range}
              checked={filters.salary === range}
              onChange={handleChange}
              onClick={handleChange}
              className="accent-indigo-600 w-4 h-4 cursor-pointer"
            />
            <span className="group-hover:text-indigo-600 transition-colors">
              {range}
            </span>
          </label>
        ))}
      </FilterSection>

    </div>
  );
}

export default FilterCard;