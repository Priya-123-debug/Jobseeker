import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { updateApplicantStatus } from "../redux/applicantSlice";
import { APPLICATION_API_END_POINT } from "../utilis/constant";

const STATUS_OPTIONS = ["pending", "reviewing", "interviewing", "accepted", "rejected"];

const STATUS_STYLES = {
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
  reviewing: "bg-blue-100 text-blue-700",
  interviewing: "bg-purple-100 text-purple-700",
};

function StatusBadge({ status }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}>
      {status}
    </span>
  );
}

function StatusDropdown({ app, loadingRows, handleStatus }) {
  return (
    <select
      value={app.status}
      disabled={loadingRows[app._id]}
      onChange={(e) => handleStatus(app._id, e.target.value)}
      className={`text-xs border rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer transition
        ${loadingRows[app._id] ? "opacity-50 cursor-not-allowed" : ""}
        ${STATUS_STYLES[app.status] || STATUS_STYLES.pending}`}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s} className="bg-white text-gray-800 capitalize">
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
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
      toast.success(`Status updated to ${newStatus}`);
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
              <th className="px-4 py-3 text-center">Change Status</th>
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
                  <StatusDropdown app={app} loadingRows={loadingRows} handleStatus={handleStatus} />
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
            <div className="mt-2">
              <label className="text-xs text-gray-500 mb-1 block">Update Status</label>
              <StatusDropdown app={app} loadingRows={loadingRows} handleStatus={handleStatus} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Applicantstable;