import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { JOB_API_END_POINT } from "../utilis/constant";

const useGetFilterOptions = () => {
  const { user } = useSelector((store) => store.auth);
  const [options, setOptions] = useState({
    locations: [],
    industries: [],
    salaryRange: { minSalary: 0, maxSalary: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOptions = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/filter-options`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setOptions({
            locations: res.data.locations,
            industries: res.data.industries,
            salaryRange: res.data.salaryRange,
          });
        }
      } catch (err) {
        console.error("Error fetching filter options:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [user]);

  return { ...options, loading };
};

export default useGetFilterOptions;