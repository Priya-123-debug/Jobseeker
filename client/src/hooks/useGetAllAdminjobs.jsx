import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAllAdminjobs } from "../redux/jobSlice";
import { JOB_API_END_POINT } from "../utilis/constant";

const useGetAllAdminjobs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth); // NEW: read logged-in user

  useEffect(() => {
    if (!user) {           // NEW: bail out early if no one is logged in
      dispatch(setAllAdminjobs([]));
      return;
    }

    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAllAdminjobs(res.data.jobs));
        }
      } catch (error) {
        console.log("Error fetching jobs:", error);
      }
    };

    fetchAllJobs();
  }, [dispatch, user]); // NEW: user added so this re-runs when login state changes
};

export default useGetAllAdminjobs;