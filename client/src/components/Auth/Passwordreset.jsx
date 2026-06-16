import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { USER_API_END_POINT } from "../../utilis/constant";
import { useNavigate, useLocation, Link } from "react-router-dom";

function Passwordreset() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const otp = location.state?.otp;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email || !otp) {
      toast.error("Invalid password reset flow");
      navigate("/forget-password-otp");
    }
  }, [email, otp, navigate]);

  const strength = (pw) => {
    if (!pw) return { label: "", color: "" };
    if (pw.length < 6) return { label: "Weak", color: "bg-red-400", width: "w-1/4" };
    if (pw.length < 10) return { label: "Fair", color: "bg-yellow-400", width: "w-2/4" };
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) return { label: "Strong", color: "bg-green-500", width: "w-full" };
    return { label: "Good", color: "bg-blue-400", width: "w-3/4" };
  };

  const pw = strength(password);

  const handleReset = async () => {
    if (!password || !confirmPassword) return toast.error("Fill both fields");
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/reset-password`, {
        email,
        otp,
        newPassword: password,
      });
      if (res.data.success) {
        toast.success("Password reset successful!");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-orange-500 px-4 py-10">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-10">

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-800">
            Reset Password
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Create a new strong password
          </p>
        </div>

        <div className="space-y-5">

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition pr-14"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium"
              >
                {showNew ? "Hide" : "Show"}
              </button>
            </div>
            {/* Strength bar */}
            {password && (
              <div className="mt-2">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${pw.color} ${pw.width}`} />
                </div>
                <p className={`text-xs mt-1 font-medium ${pw.color.replace("bg-", "text-")}`}>
                  {pw.label}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition pr-14 ${
                  confirmPassword && confirmPassword !== password
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-300 focus:ring-orange-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {confirmPassword && confirmPassword !== password && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            onClick={handleReset}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition active:scale-95 ${
              loading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>

        <div className="mt-6 pt-5 border-t text-center text-sm text-gray-600">
          <Link to="/login" className="text-purple-700 font-semibold hover:underline">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Passwordreset;