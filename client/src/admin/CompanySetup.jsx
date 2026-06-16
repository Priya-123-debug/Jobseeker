import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { COMPANY_API_END_POINT } from "../utilis/constant";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import useGetCompanybyid from "../hooks/useGetCompanybyid";

function CompanySetup() {
  const { id } = useParams();
  useGetCompanybyid(id);
  const navigate = useNavigate();
  const { singleCompany } = useSelector((store) => store.company);

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [input, setInput] = useState({
    CompanyName: "",
    website: "",
    description: "",
    location: "",
    file: null,
  });

  useEffect(() => {
    if (singleCompany) {
      setInput({
        CompanyName: singleCompany.name || "",
        website: singleCompany.website || "",
        description: singleCompany.description || "",
        location: singleCompany.location || "",
        file: null,
      });
      setPreview(singleCompany.logo || null);
    }
  }, [singleCompany]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    setInput({ ...input, file });
    if (file) setPreview(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("CompanyName", input.CompanyName);
      formData.append("website", input.website);
      formData.append("description", input.description);
      formData.append("location", input.location);
      if (input.file) formData.append("profileImage", input.file);

      const res = await axios.put(`${COMPANY_API_END_POINT}/update/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Company updated successfully");
        navigate("/admin/companies");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!singleCompany) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-500 text-sm">Loading company details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-8">

          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Company Setup</h1>
            <button
              onClick={() => navigate("/admin/companies")}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition active:scale-95"
            >
              ← Back
            </button>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">

            {/* Logo preview */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-3xl text-gray-300">🏢</span>
                )}
              </div>
              <label className="text-sm text-indigo-600 font-medium cursor-pointer hover:underline">
                {preview ? "Change Logo" : "Upload Logo"}
                <input type="file" accept="image/*" onChange={fileChangeHandler} className="hidden" />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text" name="CompanyName" value={input.CompanyName} onChange={changeEventHandler}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url" name="website" value={input.website} onChange={changeEventHandler}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description" value={input.description} onChange={changeEventHandler} rows={4}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text" name="location" value={input.location} onChange={changeEventHandler}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition active:scale-95 ${
                loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Saving..." : "Save & Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompanySetup;