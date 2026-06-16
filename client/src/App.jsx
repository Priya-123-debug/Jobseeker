import React from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Auth/Login.jsx";
import Signup from "./components/Auth/Signup.jsx";
import Jobs from "./components/Jobs.jsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Browse from "./components/Browse.jsx";
import Profile from "./components/Profile.jsx";
import Jobdescription from "./components/Jobdescription.jsx"
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "./redux/authSlice";
import { USER_API_END_POINT } from "./utilis/constant";
import { useEffect } from "react";
import Companies from "./admin/Companies.jsx";
import Companycreate from "./admin/Companycreate.jsx";
import CompanySetup from "./admin/CompanySetup.jsx";
import AdminJobs from "./admin/AdminJobs.jsx";
import Postjob from "./admin/Postjob.jsx";
import Applicants from "./admin/Applicants.jsx";
import LoginOtp from "./components/Auth/LoginOtp.jsx";
import Forgetpassword from "./components/Auth/Forgetpassword.jsx";
import Passwordreset from "./components/Auth/Passwordreset.jsx"
import Dashboard from "./admin/AdminDashboard.jsx";




const approuter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Navbar />
        <Login />
      </>
    ),
  },
  {
    path: "/login-otp",
    element: (
      <>
        <Navbar />
        <LoginOtp />
      </>
    ),
  },
   {
    path: "/forget-password-otp",
    element: (
      <>
        <Navbar />
        <Forgetpassword />
      </>
    ),
  },
    {
    path: "/password-reset",
    element: (
      <>
        <Navbar />
        <Passwordreset/>
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <Navbar />
        <Signup />
      </>
    ),
  },
  {
    path:"/jobs",
    element:(
      <>
      <Navbar/>
      <Jobs/>
      </>
    )
  },
  {
    path: "/browse",
    element: (
      <>
        <Navbar />
        <Browse />
      </>
    ),
  },
  {
    path: "/profile",
    element: (
      <>
        <Navbar />
       <Profile/>
      </>
    ),
  },
   {
    path: "/description/:id",
    element: (
      <>
        <Navbar />
      <Jobdescription/>
      </>
    ),
  },
  {
    path:"/admin/companies",
    element:<Companies/>
  },
  {
      path:"/admin/companies/create",
    element:<Companycreate/>

  },
   {
      path:"/admin/companies/:id",
    element:<CompanySetup/>

  },
   {
      path:"/admin/jobs",
    element:<AdminJobs/>

  },
   {
      path:"/admin/jobs/create",
    element:<Postjob/>

  },
   {
      path:"/admin/jobs/:id/applicants",
    element:<Applicants/>

  },
  {
  path: "/admin/dashboard",
  element: (
    <>
      
      <Dashboard />
    </>
  ),
},


]);


function App() {
  const dispatch = useDispatch();

useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${USER_API_END_POINT}/me`,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
      }
    } catch (err) {
      dispatch(setUser(null));
    }
  };

  fetchUser();
}, []);
  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={approuter} />
    </>
  );
}


export default App;
