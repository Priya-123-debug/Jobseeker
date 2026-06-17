import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters as setJobFilters } from "../redux/jobSlice";

const LOCATIONS = ["Bangalore", "Hyderabad", "Pune", "Mumbai", "Delhi", "Remote"];
const INDUSTRIES = ["IT", "Design", "Finance", "Marketing", "Healthcare", "Education"];
const SALARIES = ["0 - 5 LPA", "5 - 10 LPA", "10 - 20 LPA", "20+ LPA"];

function getSalaryRange(label) {
  if (label === "0 - 5 LPA") return { min: 0, max: 500000 };
  if (label === "5 - 10 LPA") return { min: 500000, max: 1000000 };
  if (label === "10 - 20 LPA") return { min: 1000000, max: 2000000 };
  if (label === "20+ LPA") return { min: 2000000, max: 100000000 };
  return { min: 0, max: 0 };
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
    const isDeselecting = filters[name] === value;
    const newValue = isDeselecting ? "" : value;

    const updated = { ...filters, [name]: newValue };
    
    if (name === "salary") {
      const range = getSalaryRange(newValue);
      updated.minSalary = newValue ? range.min : 0;
      updated.maxSalary = newValue ? range.max : 0;
    }

    setFilters(updated);
    dispatch(setJobFilters(updated));
  };

  const handleClear = () => {
    const reset = { location: "", industry: "", salary: "", minSalary: 0, maxSalary: 0 };
    setFilters(reset);
    dispatch(setJobFilters(reset));
  };

  const activeCount = [filters.location, filters.industry, filters.salary].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-800">Filters</h2>
        {activeCount > 0 && (
          <button onClick={handleClear} className="text-xs text-red-500 font-semibold hover:underline">
            Clear all
          </button>
        )}
      </div>

      {/* Location Section */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Location</h3>
        {LOCATIONS.map((loc) => (
          <label key={loc} className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer py-1">
            <input type="radio" name="location" value={loc} checked={filters.location === loc} onChange={handleChange} className="accent-indigo-600 w-4 h-4" />
            {loc}
          </label>
        ))}
      </div>

      {/* Industry Section */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Industry</h3>
        {INDUSTRIES.map((ind) => (
          <label key={ind} className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer py-1">
            <input type="radio" name="industry" value={ind} checked={filters.industry === ind} onChange={handleChange} className="accent-indigo-600 w-4 h-4" />
            {ind}
          </label>
        ))}
      </div>

      {/* Salary Section */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Salary Range</h3>
        {SALARIES.map((range) => (
          <label key={range} className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer py-1">
            <input type="radio" name="salary" value={range} checked={filters.salary === range} onChange={handleChange} className="accent-indigo-600 w-4 h-4" />
            {range}
          </label>
        ))}
      </div>
    </div>
  );
}

export default FilterCard;