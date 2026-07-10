import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BOOKMARK_API_END_POINT } from "../utilis/constant";
import { setBookmarks } from "../redux/bookmarkSlice";

const useGetBookmarks = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!user) {
      dispatch(setBookmarks([]));
      return;
    }

    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(`${BOOKMARK_API_END_POINT}/all`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setBookmarks(res.data.bookmarks));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookmarks();
  }, [dispatch, user]);
};

export default useGetBookmarks;