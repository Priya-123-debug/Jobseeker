import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "../hooks/useGetAllCompanies";
import { useDispatch } from "react-redux";
import { setsearchbyCompanybytext } from "../redux/companySlice";

function Companies() {
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setsearchbyCompanybytext(input));
  }, [input]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Companies</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your registered companies</p>
        </div>

        {/* Search + New Company — stacked on mobile, row on desktop */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
          <div className="relative w-full sm:max-w-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Filter by company name"
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <button
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-900 hover:bg-gray-800 active:scale-95 text-white rounded-xl text-sm font-semibold transition whitespace-nowrap"
            onClick={() => navigate("/admin/companies/create")}
          >
            + New Company
          </button>
        </div>

        <CompaniesTable />
      </div>
    </div>
  );
}

export default Companies;