import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Applicantstable from "./Applicantstable";
import { APPLICATION_API_END_POINT } from "../utilis/constant";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "../redux/applicantSlice";
import axios from "axios";
import toast from "react-hot-toast";

function Applicants() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAllApplicants(res.data.job.applications));
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load applicants");
      }
    };
    fetchApplicants();
  }, [params.id, dispatch]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-4 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </button>

        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Applicants
            <span className="ml-2 inline-flex items-center justify-center text-sm bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full">
              {applicants?.length || 0}
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage applications</p>
        </div>

        <Applicantstable />
      </div>
    </div>
  );
}

export default Applicants;