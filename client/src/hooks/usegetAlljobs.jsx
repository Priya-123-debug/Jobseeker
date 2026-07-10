import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAllJobs } from "../redux/jobSlice";
import { JOB_API_END_POINT } from "../utilis/constant";

const usegetAlljobs = ({
  page = 1,
  location = "",
  industry = "",
  minSalary = 0,
  maxSalary = 0,
  keyword = "",
} = {}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      dispatch(setAllJobs([]));
      setLoading(false);
      return;
    }

    const fetchAllJobs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${JOB_API_END_POINT}/get?page=${page}&location=${location}&industry=${industry}&minSalary=${minSalary}&maxSalary=${maxSalary}&keyword=${keyword}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
          setTotalPages(res.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobs();
  }, [dispatch, user, page, location, industry, minSalary, maxSalary, keyword]);

  return { totalPages, loading };
};

export default usegetAlljobs;