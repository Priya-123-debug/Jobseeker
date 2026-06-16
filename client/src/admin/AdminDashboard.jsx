import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import { JOB_API_END_POINT } from "../utilis/constant";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

function StatCard({ label, value, color, icon }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/stats`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <p className="text-center py-24 text-gray-500">Could not load stats.</p>
      </div>
    );
  }

  // Data shape recharts needs for the pie chart
  const pieData = [
    { name: "Accepted", value: stats.accepted },
    { name: "Rejected", value: stats.rejected },
    { name: "Pending", value: stats.pending },
  ];

  const COLORS = {
    Accepted: "#16a34a", // green
    Rejected: "#dc2626", // red
    Pending: "#ca8a04",  // yellow
  };

  const hasApplicants = stats.totalApplicants > 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of your job postings and applicants
          </p>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Jobs Posted" value={stats.totalJobs} color="bg-indigo-100" icon="📋" />
          <StatCard label="Total Applicants" value={stats.totalApplicants} color="bg-blue-100" icon="👥" />
          <StatCard label="Acceptance Rate" value={`${stats.acceptanceRate}%`} color="bg-green-100" icon="✅" />
          <StatCard label="Pending Review" value={stats.pending} color="bg-yellow-100" icon="⏳" />
        </div>

        {/* ── Chart + breakdown ── */}
        <div className="bg-white rounded-2xl border shadow-sm p-5 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Applicant Status Breakdown
          </h2>

          {!hasApplicants ? (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="text-4xl mb-3">📭</span>
              <p className="text-gray-500">No applicants yet — post a job to get started</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-8">

              {/* Pie chart */}
              <div className="w-full sm:w-1/2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Numeric breakdown */}
              <div className="w-full sm:w-1/2 space-y-3">
                <BreakdownRow label="Accepted" value={stats.accepted} color="bg-green-500" />
                <BreakdownRow label="Rejected" value={stats.rejected} color="bg-red-500" />
                <BreakdownRow label="Pending" value={stats.pending} color="bg-yellow-500" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BreakdownRow({ label, value, color }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-sm text-gray-600 flex-1">{label}</span>
      <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
  );
}

export default Dashboard;