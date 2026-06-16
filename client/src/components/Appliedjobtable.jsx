import React from "react";
import { useSelector } from "react-redux";
import {
  Briefcase,
  DollarSign,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs";

/* ── Status config ── */
const STATUS_CONFIG = {
  accepted: {
    label: "Accepted",
    icon: <CheckCircle size={13} />,
    badge: { background: "#DCFCE7", color: "#166534" },
    bar: "#22C55E",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle size={13} />,
    badge: { background: "#FEE2E2", color: "#991B1B" },
    bar: "#EF4444",
  },
  pending: {
    label: "Pending",
    icon: <Clock size={13} />,
    badge: { background: "#FEF9C3", color: "#854D0E" },
    bar: "#F59E0B",
  },
};

function AppliedJobs() {
  useGetAppliedJobs();
  const appliedJobs = useSelector((state) => state.appliedJobs.jobs);

  if (!appliedJobs?.length) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-sm w-full">
          <div
            className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ background: "#EDE9FF" }}
          >
            <FileText size={24} style={{ color: "#6C47FF" }} />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            No applications yet
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            You haven't applied to any jobs. Start exploring opportunities and
            submit your first application.
          </p>
        </div>
      </div>
    );
  }

  const accepted = appliedJobs.filter((j) => j.status === "accepted").length;
  const pending = appliedJobs.filter((j) => j.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Applied jobs
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Track and manage your job applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="Total applied" value={appliedJobs.length} color="#6C47FF" />
          <StatCard label="Accepted" value={accepted} color="#22C55E" />
          <StatCard label="Pending" value={pending} color="#F59E0B" />
        </div>

        {/* Job cards */}
        <div className="flex flex-col gap-3">
          {appliedJobs.map((app) => {
            const config = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
            return (
              <div
                key={app._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex"
                style={{ borderLeft: `3px solid ${config.bar}` }}
              >
                <div className="flex-1 p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    {/* Left */}
                    <div className="flex items-start gap-3">
                      {/* Logo */}
                      {app.logo ? (
                        <img
                          src={app.logo}
                          alt={app.company}
                          className="w-11 h-11 rounded-xl border border-gray-100 object-contain bg-white p-1 flex-shrink-0"
                        />
                      ) : (
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-xs font-semibold flex-shrink-0 border border-gray-100"
                          style={{ background: "#F5F3FF", color: "#6C47FF" }}
                        >
                          {app.company?.slice(0, 2).toUpperCase() || "NA"}
                        </div>
                      )}

                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {app.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {app.company}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <MetaItem
                            icon={<Briefcase size={12} />}
                            text={`${app.experience} yrs exp`}
                          />
                          <MetaItem
                            icon={<DollarSign size={12} />}
                            text={`₹${app.Salary?.toLocaleString()}`}
                          />
                          {app.location && (
                            <MetaItem
                              icon={<MapPin size={12} />}
                              text={app.location}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                        style={config.badge}
                      >
                        {config.icon}
                        {config.label}
                      </span>
                      {app.createdAt && (
                        <span className="text-xs text-gray-300">
                          {new Date(app.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MetaItem({ icon, text }) {
  return (
    <span className="flex items-center gap-1 text-xs text-gray-400">
      <span style={{ color: "#9B8FCC" }}>{icon}</span>
      {text}
    </span>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
      <p className="text-2xl font-semibold" style={{ color }}>
        {value}
      </p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}

export default AppliedJobs;