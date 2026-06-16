
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import { COMPANY_API_END_POINT } from "../utilis/constant";
import { setCompanies } from "../redux/companySlice";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchcompanies= async () => {
      try {
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/get`,
				
          { withCredentials: true }
        );

        if (res.data.success) {
         	dispatch(setCompanies(res.data.companies))
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

   fetchcompanies ();
  }, [dispatch]);
};

export default useGetAllCompanies;

