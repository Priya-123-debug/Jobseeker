import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Mail,
  Phone,
  FileText,
  Edit3,
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Appliedjobtable from "./Appliedjobtable";
import Updateprofile from "./Updateprofile";

function Profile() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useSelector((store) => store.auth);

  const skills = user?.profile?.skills || [];
  const hasResume = !!user?.profile?.resume;
  const appliedJobs = useSelector((state) => state.appliedJobs?.jobs || []);

  const accepted = appliedJobs.filter((j) => j.status === "accepted").length;
  const pending = appliedJobs.filter((j) => j.status === "pending").length;
  const rejected = appliedJobs.filter((j) => j.status === "rejected").length;

  const initials = user?.fullname
    ? user.fullname
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-4">

        {/* ── Profile Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">

          {/* Cover */}
          <div
            className="h-28"
            style={{
              background:
                "linear-gradient(120deg, #6C47FF 0%, #9B77FF 60%, #F59E0B 100%)",
            }}
          />

          {/* Body */}
          <div className="px-6 pb-6">
            {/* Avatar + Edit row */}
            <div className="flex items-end justify-between -mt-9 mb-4">
              <div className="relative">
                {user?.profile?.profileImage ? (
                  <img
                    src={user.profile.profileImage}
                    alt="Profile"
                    className="w-[72px] h-[72px] rounded-full object-cover ring-[3px] ring-white shadow"
                  />
                ) : (
                  <div
                    className="w-[72px] h-[72px] rounded-full ring-[3px] ring-white shadow flex items-center justify-center text-lg font-semibold text-white"
                    style={{ background: "#6C47FF" }}
                  >
                    {initials}
                  </div>
                )}
                <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full ring-2 ring-white" />
              </div>

              <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-xl transition-all active:scale-95"
                style={{ background: "#6C47FF" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#5535e0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#6C47FF")
                }
              >
                <Edit3 size={14} />
                Edit profile
              </button>
            </div>

            {/* Name + Bio */}
            <h1 className="text-xl font-semibold text-gray-900">
              {user?.fullname || "Your Name"}
            </h1>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed max-w-lg">
              {user?.profile?.bio ||
                "No bio yet. Click Edit profile to add one."}
            </p>

            <hr className="my-4 border-gray-100" />

            {/* Contact + Resume */}
            <div className="flex flex-wrap gap-4 items-center">
              {user?.email && (
                <ContactItem icon={<Mail size={14} />} text={user.email} />
              )}
              {user?.phoneNumber && (
                <ContactItem
                  icon={<Phone size={14} />}
                  text={user.phoneNumber}
                />
              )}
              {hasResume && (
                <a
                  href={user.profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm font-medium"
                  style={{ color: "#6C47FF" }}
                >
                  <FileText size={14} />
                  View resume
                </a>
              )}
              {!hasResume && (
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                  <FileText size={14} />
                  No resume uploaded
                </span>
              )}
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-medium rounded-full border"
                      style={{
                        background: "#EDE9FF",
                        color: "#4527C2",
                        borderColor: "#C4B5FD",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-6">
            {["overview", "applications"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-3 text-sm font-medium capitalize transition-all border-b-2 -mb-px"
                style={{
                  color: activeTab === tab ? "#6C47FF" : "#9CA3AF",
                  borderBottomColor:
                    activeTab === tab ? "#6C47FF" : "transparent",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab: Overview — stats */}
          {activeTab === "overview" && (
            <div className="px-6 py-5 grid grid-cols-3 gap-3">
              <StatCard
                label="Total applied"
                value={appliedJobs.length}
                color="#6C47FF"
              />
              <StatCard
                label="Accepted"
                value={accepted}
                color="#22C55E"
              />
              <StatCard
                label="Pending"
                value={pending}
                color="#F59E0B"
              />
            </div>
          )}

          {/* Tab: Applications — table */}
          {activeTab === "applications" && (
            <div className="px-6 py-4 overflow-x-auto">
              <Appliedjobtable />
            </div>
          )}
        </div>

      </div>

      <Updateprofile open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function ContactItem({ icon, text }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-500">
      <span style={{ color: "#6C47FF" }}>{icon}</span>
      {text}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
      <p className="text-2xl font-semibold" style={{ color }}>
        {value}
      </p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}

export default Profile;