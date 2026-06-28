import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { setLoading, setUser } from "../redux/authSlice";
import { USER_API_END_POINT } from "../utilis/constant";
import { FileText, Upload, X } from "lucide-react";

function Updateprofile({ open, onClose }) {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((store) => store.auth);

  const resumeInputRef = useRef(null);
  const profileImageInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null); // ✅ Bug 1 fix: was missing, used but never declared

  /* ================= PREFILL ================= */
  useEffect(() => {
    if (open && user) {
      setFormData({
        fullname: user.fullname || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.profile?.bio || "",
        skills: user.profile?.skills?.join(", ") || "",
      });
      setResumeFile(null);
      setProfileImageFile(null);
    }
  }, [open, user]);

  /* ================= CLOSE HANDLER ================= */
  const handleClose = () => {
    setResumeFile(null);
    setProfileImageFile(null);
    onClose();
  };

  /* ================= RESUME FILE HANDLER ================= */
  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(file.type)) {
      toast.error("Only PDF or Word documents are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5 MB");
      e.target.value = "";
      return;
    }

    setResumeFile(file);
  };

  /* ================= PROFILE IMAGE HANDLER ================= */
  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG or WEBP images are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2 MB");
      e.target.value = "";
      return;
    }

    setProfileImageFile(file);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));

      const data = new FormData();
      data.append("fullname", formData.fullname);
      data.append("email", formData.email);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("bio", formData.bio);

      //  Bug 2 fix: resume was being appended TWICE in original code
      if (resumeFile) data.append("resume", resumeFile);
      if (profileImageFile) data.append("profileImage", profileImageFile);

      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      data.append("skills", JSON.stringify(skillsArray));

      const res = await axios.put(
        `${USER_API_END_POINT}/profile/update`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Profile updated successfully");
        handleClose();
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!open) return null;

  const hasExistingResume = !!user?.profile?.resume;
  const hasExistingProfileImage = !!user?.profile?.profileImage;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-2 sm:p-4">
      <div className="absolute inset-0" onClick={handleClose} />

      <div className="relative z-10 bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl shadow-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg sm:text-xl font-semibold">Edit Profile</h2>
          <button type="button" onClick={handleClose}
            className="text-2xl text-gray-500 hover:text-black transition">
            ×
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">

          {/* ── PROFILE IMAGE UPLOAD ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Photo
            </label>

            {/* Preview */}
            {(profileImageFile || hasExistingProfileImage) && (
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={profileImageFile
                    ? URL.createObjectURL(profileImageFile)
                    : user.profile.profileImage}
                  alt="Profile preview"
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
                <span className="text-sm text-gray-500">
                  {profileImageFile ? profileImageFile.name : "Current photo"}
                </span>
                {profileImageFile && (
                  <button type="button"
                    onClick={() => {
                      setProfileImageFile(null);
                      if (profileImageInputRef.current) profileImageInputRef.current.value = "";
                    }}
                    className="ml-auto text-gray-400 hover:text-red-500 transition">
                    <X size={14} />
                  </button>
                )}
              </div>
            )}

            <div
              onClick={() => profileImageInputRef.current?.click()}
              className="flex items-center gap-3 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition"
            >
              <Upload size={16} className="text-gray-400 shrink-0" />
              <span className="text-sm text-gray-500">
                {hasExistingProfileImage
                  ? "Replace photo (JPG / PNG / WEBP, max 2 MB)"
                  : "Upload photo (JPG / PNG / WEBP, max 2 MB)"}
              </span>
            </div>

            <input
              ref={profileImageInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleProfileImageChange}
            />
          </div>

          <Input label="Full Name" name="fullname" value={formData.fullname}
            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} />

          <Input label="Email" name="email" type="email" value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

          <Input label="Phone Number" name="phoneNumber" value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />

          <Textarea label="Bio" name="bio" value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />

          <Input label="Skills (comma separated)" name="skills" value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />

          {/* ── RESUME UPLOAD ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume
            </label>

            {hasExistingResume && !resumeFile && (
              <div className="flex items-center gap-2 mb-2 text-sm text-indigo-600">
                <FileText size={14} />
                <a href={user.profile.resume} target="_blank" rel="noreferrer"
                  className="underline underline-offset-2 hover:text-indigo-800">
                  View current resume
                </a>
              </div>
            )}

            <div
              onClick={() => resumeInputRef.current?.click()}
              className="flex items-center gap-3 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition"
            >
              <Upload size={16} className="text-gray-400 shrink-0" />
              <span className="text-sm text-gray-500 truncate">
                {resumeFile
                  ? resumeFile.name
                  : hasExistingResume
                  ? "Replace resume (PDF / DOC / DOCX, max 5 MB)"
                  : "Upload resume (PDF / DOC / DOCX, max 5 MB)"}
              </span>
              {resumeFile && (
                <button type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setResumeFile(null);
                    if (resumeInputRef.current) resumeInputRef.current.value = "";
                  }}
                  className="ml-auto text-gray-400 hover:text-red-500 transition">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* ✅ Bug 3 fix: ref was named fileInputRef but now correctly resumeInputRef */}
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleResumeChange}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <button type="button" onClick={handleClose}
              className="w-full sm:w-auto border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input {...props}
      className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea {...props} rows={3}
      className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
  </div>
);

export default Updateprofile;