import { useEffect } from "react";
import { useSelector } from "react-redux";
import useGetBookmarks from "../hooks/useGetBookmarks";
import JobCard from "./JobCard"; // your existing job card component

const Bookmarks = () => {
  useGetBookmarks();
  const { bookmarks } = useSelector(state => state.bookmark);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Saved Jobs</h1>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No saved jobs yet</p>
          <p className="text-sm mt-2">Click the bookmark icon on any job to save it</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookmarks.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;