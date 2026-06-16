import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "../utilis/constant";
import { setUser } from "../redux/authSlice";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logouthandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

return (
  <div className="bg-white shadow w-full">
    <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
      {/* Logo */}
      <h1 className="text-2xl font-bold">
        Job<span className="text-[#F83002]">Portal</span>
      </h1>

      {/* Hamburger button — only on mobile */}
      <button
        className="md:hidden text-gray-700 text-2xl"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>

      {/* Desktop nav links */}
      <ul className="hidden md:flex items-center gap-6 font-medium">
        {user && user.role === "recruiter" ? (
          <>
            <li><Link to="/admin/companies">Companies</Link></li>
            <li><Link to="/admin/jobs">Jobs</Link></li>
             <li><Link to="/admin/dashboard">Dashboard</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/jobs">Jobs</Link></li>
            <li><Link to="/browse">Browse</Link></li>
          </>
        )}
      </ul>

      {/* Auth buttons — desktop */}
      <div className="hidden md:flex items-center gap-2">
        {!user ? (
          <>
            <Link to="/login"><button className="font-bold">Login</button></Link>
            <Link to="/signup"><button className="font-bold">Sign up</button></Link>
          </>
        ) : (
          <div className="relative">
            <img
              src={user?.profile?.profileImage || "https://i.pravatar.cc/100"}
              alt="avatar"
              className="w-10 h-10 rounded-full cursor-pointer object-cover"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-40 bg-white rounded-lg shadow-md z-50">
                <div className="px-4 py-3">
                  <p className="font-semibold">{user?.fullname}</p>
                </div>
                <ul className="flex flex-col">
                  {user.role === "student" && (
                    <Link to="/profile">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">View Profile</li>
                    </Link>
                  )}
                  <button className="flex" onClick={logouthandler}>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600">Logout</li>
                  </button>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>

    {/* Mobile dropdown menu */}
    {isMenuOpen && (
      <div className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-3">
        {user && user.role === "recruiter" ? (
          <>
            <Link to="/admin/companies" onClick={() => setIsMenuOpen(false)}>Companies</Link>
             <li><Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
            <Link to="/admin/jobs" onClick={() => setIsMenuOpen(false)}>Jobs</Link>
          </>
        ) : (
          <>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/jobs" onClick={() => setIsMenuOpen(false)}>Jobs</Link>
            <Link to="/browse" onClick={() => setIsMenuOpen(false)}>Browse</Link>
          </>
        )}
        {!user ? (
          <>
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
            <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
          </>
        ) : (
          <>
            {user.role === "student" && (
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>View Profile</Link>
            )}
            <button onClick={logouthandler} className="text-red-600 text-left">Logout</button>
          </>
        )}
      </div>
    )}
  </div>
);
}

export default Navbar;
