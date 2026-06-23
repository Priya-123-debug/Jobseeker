import React from "react";
import { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { toggleBookmarkLocal } from "../redux/bookmarkSlice";
import { BOOKMARK_API_END_POINT } from "../utilis/constant";
import { Bookmark, BookmarkCheck } from "lucide-react";

const BookmarkButton = ({ jobId }) => {
  const dispatch = useDispatch();
  const { bookmarks } = useSelector(state => state.bookmark);
  const [loading, setLoading] = useState(false);

  const isBookmarked = bookmarks.some(job => job._id === jobId);

  const handleToggle = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${BOOKMARK_API_END_POINT}/toggle/${jobId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(toggleBookmarkLocal(jobId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${
        isBookmarked
          ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
          : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
      }`}
    >
      {isBookmarked ? (
        <BookmarkCheck size={20} />
      ) : (
        <Bookmark size={20} />
      )}
    </button>
  );
};

export default BookmarkButton;