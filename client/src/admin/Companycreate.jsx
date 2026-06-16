import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { COMPANY_API_END_POINT } from "../utilis/constant";
import { setsingleCompany } from "../redux/companySlice";

function Companycreate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);

  const isDisabled = !companyName.trim() || !website.trim() || loading;

  const registernewcompany = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { CompanyName: companyName, website },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      if (res?.data?.success) {
        dispatch(setsingleCompany(res.data.Company));
        toast.success(res.data.message);
        navigate(`/admin/companies/${res.data.Company._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Create Company</h1>
          <p className="text-sm text-gray-500 mb-6">
            Enter your company details. You can update them later.
          </p>

          {/* Company Name */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              placeholder="Microsoft"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            />
          </div>

          {/* Website */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Website
            </label>
            <input
              type="text"
              placeholder="https://www.microsoft.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            />
          </div>

          {/* Buttons — stack on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <button
              onClick={() => navigate("/admin/companies")}
              className="px-6 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-sm font-medium transition order-2 sm:order-1"
            >
              Cancel
            </button>

            <button
              onClick={registernewcompany}
              disabled={isDisabled}
              className={`px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition active:scale-95 order-1 sm:order-2 ${
                isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800"
              }`}
            >
              {loading ? "Creating..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Companycreate;