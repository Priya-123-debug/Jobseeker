import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAppliedJobs } from "../redux/appliedJobsSlice";
import { APPLICATION_API_END_POINT } from "../utilis/constant";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!user) {
      dispatch(setAppliedJobs([]));
      return;
    }

    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
          withCredentials: true,
        });

        if (res.data.success) {
          const normalizedJobs = res.data.applications.map((app) => ({
            _id: app._id,
            jobId: app.job?._id,
            title: app.job?.title,
            location: app.job?.location,
            experience: app.job?.experience,
            salary: app.job?.Salary,
            company: app.job?.company?.name,
            logo: app.job?.company?.logo,
            status: app.status,
          }));

          dispatch(setAppliedJobs(normalizedJobs));
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

    fetchAppliedJobs();
  }, [dispatch, user]);
};

export default useGetAppliedJobs;