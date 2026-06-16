import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "../hooks/useGetAllCompanies";

function CompaniesTable() {
  useGetAllCompanies();
  const navigate = useNavigate();
  const { companies, searchCompanybytext } = useSelector((store) => store.company);
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    if (!companies || companies.length === 0) {
      setFilteredCompanies([]);
      return;
    }
    const filtered = companies.filter((company) => {
      if (!searchCompanybytext) return true;
      return company?.name?.toLowerCase().includes(searchCompanybytext.toLowerCase());
    });
    setFilteredCompanies(filtered);
  }, [companies, searchCompanybytext]);

  if (filteredCompanies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border">
        <span className="text-4xl mb-3">🏢</span>
        <p className="text-gray-500 font-medium">No companies found</p>
        <p className="text-xs text-gray-400 mt-1">
          Try a different search or register a new company
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop table (md and up) ── */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-2xl border shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Logo</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredCompanies.map((company) => (
              <tr key={company._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <img
                    src={company.logo || "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_32dp.png"}
                    alt={company.name}
                    className="h-9 w-9 rounded object-contain border bg-white"
                  />
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{company.name}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(company.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => navigate(`/admin/companies/${company._id}`)}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards (below md) ── */}
      <div className="md:hidden space-y-3">
        {filteredCompanies.map((company) => (
          <div key={company._id} className="bg-white rounded-xl border p-4 flex items-center gap-3">
            <img
              src={company.logo || "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_32dp.png"}
              alt={company.name}
              className="h-12 w-12 rounded-lg object-contain border bg-white flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{company.name}</p>
              <p className="text-xs text-gray-400">
                {new Date(company.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>
            <button
              onClick={() => navigate(`/admin/companies/${company._id}`)}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium active:scale-95 transition flex-shrink-0"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default CompaniesTable;