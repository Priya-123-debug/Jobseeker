import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAllJobs } from "../redux/jobSlice";
import { JOB_API_END_POINT } from "../utilis/constant";

// 1. Add '= {}' to the parameter list to handle undefined calls
// 2. Set default values for all parameters to avoid sending "undefined" to your API
const usegetAlljobs = ({ 
  page = 1, 
  location = "", 
  industry = "", 
  minSalary = 0, 
  maxSalary = 0 
} = {}) => {
  
  const dispatch = useDispatch();
  const [totalPages, setTotalPages] = useState(1);
   const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        // Now it is safe to use these values because they are guaranteed to exist
         setLoading(true);
        const res = await axios.get(
          `${JOB_API_END_POINT}/get?page=${page}&location=${location}&industry=${industry}&minSalary=${minSalary}&maxSalary=${maxSalary}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
          setTotalPages(res.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
      finally {
        setLoading(false); 
      }
    };

    fetchAllJobs();
  }, [dispatch, page, location, industry, minSalary, maxSalary]);

  return { totalPages, loading };
};

export default usegetAlljobs;