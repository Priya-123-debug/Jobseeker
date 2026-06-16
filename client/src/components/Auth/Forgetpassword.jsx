import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { USER_API_END_POINT } from "../../utilis/constant";
import { useNavigate, Link } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleSendOtp = async () => {
    if (!email) return toast.error("Enter your email");
    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/send-otp`, { email });
      if (res.data.success) {
        toast.success("OTP sent to your email");
        setStep(2);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
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
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/verify-otp`, {
        email,
        otp: otpString,
      });
      if (res.data.success) {
        toast.success("OTP verified");
        navigate("/password-reset", { state: { email, otp: otpString } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-orange-500 px-4 py-10">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-10">

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                step >= s ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-400"
              }`}>
                {s}
              </div>
              {s < 2 && (
                <div className={`h-1 w-12 rounded transition ${step >= 2 ? "bg-orange-500" : "bg-gray-200"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="text-center mb-7">
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-800">
            {step === 1 ? "Forgot Password" : "Enter OTP"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {step === 1
              ? "Enter your registered email to receive OTP"
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registered Email
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
        )}

        {step === 2 && (
          <div className="space-y-6">
            {/* OTP boxes */}
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
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Wrong email?{" "}
              <button
                onClick={() => { setStep(1); setOtp(["","","","","",""]); }}
                className="text-orange-600 font-semibold hover:underline"
              >
                Go back
              </button>
            </p>
          </div>
        )}

        <div className="mt-6 pt-5 border-t text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link to="/login" className="text-purple-700 font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;