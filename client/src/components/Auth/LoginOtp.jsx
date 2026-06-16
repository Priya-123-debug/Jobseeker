import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../redux/authSlice";
import { USER_API_END_POINT } from "../../utilis/constant";
import { useNavigate, Link } from "react-router-dom";

function LoginOtp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((store) => store.auth);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const inputRefs = useRef([]);

  const handleSendOtp = async () => {
    if (!email) return toast.error("Enter your email first");
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/send-otp`, { email });
      if (res.data.success) {
        toast.success("OTP sent to your email");
        setOtpSent(true);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Handle each OTP box input
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only last char
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length < 6) return toast.error("Enter all 6 digits");
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/verify-otp`,
        { email, otp: otpString },
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Login successful");
        navigate(res.data.user.role === "recruiter" ? "/admin/companies" : "/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-orange-500 px-4 py-10">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📧</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-800">
            Login with OTP
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {otpSent
              ? `OTP sent to ${email}`
              : "We'll send a one-time password to your email"}
          </p>
        </div>

        {!otpSent ? (
          /* Step 1: Email */
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              />
            </div>
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition active:scale-95 ${
                loading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        ) : (
          /* Step 2: OTP boxes */
          <div className="space-y-6">
            {/* 6 OTP input boxes */}
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition active:scale-95 ${
                loading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-800"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP & Login"}
            </button>

            {/* Resend */}
            <p className="text-center text-sm text-gray-500">
              Didn't receive OTP?{" "}
              <button
                onClick={() => { setOtpSent(false); setOtp(["","","","","",""]); }}
                className="text-orange-600 font-semibold hover:underline"
              >
                Resend
              </button>
            </p>
          </div>
        )}

        <div className="mt-6 pt-5 border-t text-center text-sm text-gray-600">
          Prefer password login?{" "}
          <Link to="/login" className="text-purple-700 font-semibold hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginOtp;