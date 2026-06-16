import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { updateApplicantStatus } from "../redux/applicantSlice";
import { APPLICATION_API_END_POINT } from "../utilis/constant";

function StatusBadge({ status }) {
  const styles = {
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}

function ActionButtons({ app, loadingRows, handleStatus }) {
  if (app.status !== "pending") {
    return <span className="text-gray-400 text-xs">Action taken</span>;
  }
  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleStatus(app._id, "accepted")}
        disabled={loadingRows[app._id]}
        className={`flex-1 sm:flex-none px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition active:scale-95 ${
          loadingRows[app._id] ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loadingRows[app._id] ? "..." : "Accept"}
      </button>
      <button
        onClick={() => handleStatus(app._id, "rejected")}
        disabled={loadingRows[app._id]}
        className={`flex-1 sm:flex-none px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition active:scale-95 ${
          loadingRows[app._id] ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loadingRows[app._id] ? "..." : "Reject"}
      </button>
    </div>
  );
}

function Applicantstable() {
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);
  const [loadingRows, setLoadingRows] = useState({});

  if (!applicants || applicants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border">
        <span className="text-4xl mb-3">👥</span>
        <p className="text-gray-500 font-medium">No applicants yet</p>
      </div>
    );
  }

  const handleStatus = async (id, newStatus) => {
    try {
      setLoadingRows((prev) => ({ ...prev, [id]: true }));
      await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status: newStatus },
        { withCredentials: true }
      );
      dispatch(updateApplicantStatus({ id, status: newStatus }));
      toast.success(`Marked as ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setLoadingRows((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <>
      {/* ── Desktop table ── */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-2xl border shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Applied Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {applicants.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium text-gray-800">{app.applicant?.fullname}</td>
                <td className="px-4 py-3 text-gray-600">{app.applicant?.email}</td>
                <td className="px-4 py-3 text-gray-600">{app.applicant?.phoneNumber || "—"}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                <td className="px-4 py-3 text-center">
                  <ActionButtons app={app} loadingRows={loadingRows} handleStatus={handleStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <div className="md:hidden space-y-3">
        {applicants.map((app) => (
          <div key={app._id} className="bg-white rounded-xl border p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 truncate">{app.applicant?.fullname}</p>
                <p className="text-xs text-gray-500 truncate">{app.applicant?.email}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <div className="text-xs text-gray-500 space-y-0.5 mb-3">
              <p>📞 {app.applicant?.phoneNumber || "—"}</p>
              <p>📅 Applied {new Date(app.createdAt).toLocaleDateString()}</p>
            </div>
            <ActionButtons app={app} loadingRows={loadingRows} handleStatus={handleStatus} />
          </div>
        ))}
      </div>
    </>
  );
}

export default Applicantstable;