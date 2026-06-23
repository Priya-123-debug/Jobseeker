import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { BOOKMARK_API_END_POINT } from "../utils/constant";
import { setBookmarks } from "../redux/bookmarkSlice";

const useGetBookmarks = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(`${BOOKMARK_API_END_POINT}/all`, {
          withCredentials: true
        });
        if (res.data.success) {
          dispatch(setBookmarks(res.data.bookmarks));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookmarks();
  }, []);
};

export default useGetBookmarks;