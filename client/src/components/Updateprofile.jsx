import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { setLoading, setUser } from "../redux/authSlice";
import { USER_API_END_POINT } from "../utilis/constant";

function Updateprofile({ open, onClose }) {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((store) => store.auth);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
  });

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
    }
  }, [open, user]);

  /* ================= CLOSE HANDLER ================= */
  const handleClose = () => {
    onClose();
  };

  if (!open) return null;

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));

      const payload = {
        fullname: formData.fullname,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        bio: formData.bio,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await axios.put(
        `${USER_API_END_POINT}/profile/update`,
        payload,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Profile updated successfully");
        handleClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-2 sm:p-4">
      {/* BACKDROP */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* MODAL */}
      <div
        className="
          relative z-10
          bg-white
          w-full
          sm:max-w-lg
          rounded-t-2xl sm:rounded-xl
          shadow-xl
          p-4 sm:p-6
          max-h-[90vh]
          overflow-y-auto
        "
      >
        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg sm:text-xl font-semibold">
            Edit Profile
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="text-2xl text-gray-500 hover:text-black transition"
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            label="Full Name"
            name="fullname"
            value={formData.fullname}
            onChange={(e) =>
              setFormData({
                ...formData,
                fullname: e.target.value,
              })
            }
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />

          <Input
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                phoneNumber: e.target.value,
              })
            }
          />

          <Textarea
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={(e) =>
              setFormData({
                ...formData,
                bio: e.target.value,
              })
            }
          />

          <Input
            label="Skills (comma separated)"
            name="skills"
            value={formData.skills}
            onChange={(e) =>
              setFormData({
                ...formData,
                skills: e.target.value,
              })
            }
          />

          {/* ACTIONS */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="
                w-full sm:w-auto
                border border-gray-300
                px-4 py-2
                rounded-lg
                hover:bg-gray-100
                transition
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full sm:w-auto
                bg-indigo-600
                text-white
                px-6 py-2
                rounded-lg
                hover:bg-indigo-700
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= INPUT COMPONENT ================= */
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>

    <input
      {...props}
      className="
        w-full
        border border-gray-300
        px-3 py-2.5
        rounded-lg
        text-sm
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500
        focus:border-indigo-500
      "
    />
  </div>
);

/* ================= TEXTAREA COMPONENT ================= */
const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>

    <textarea
      {...props}
      rows={3}
      className="
        w-full
        border border-gray-300
        px-3 py-2.5
        rounded-lg
        text-sm
        resize-none
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500
        focus:border-indigo-500
      "
    />
  </div>
);

export default Updateprofile;