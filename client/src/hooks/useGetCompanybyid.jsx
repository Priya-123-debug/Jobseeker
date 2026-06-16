
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import { COMPANY_API_END_POINT } from "../utilis/constant";
import { setsingleCompany } from "../redux/companySlice";

const useGetCompanybyid = (id) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchsinglecompany = async () => {
      try {
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/get/${id}`,
				
          { withCredentials: true }
        );

        if (res.data.success) {
         	dispatch(setsingleCompany(res.data.company))
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

   fetchsinglecompany ();
  }, [dispatch,id]);
};

export default useGetCompanybyid;

