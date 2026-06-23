import { createSlice } from "@reduxjs/toolkit";

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState: {
    bookmarks: []
  },
  reducers: {
    setBookmarks: (state, action) => {
      state.bookmarks = action.payload;
    },
    toggleBookmarkLocal: (state, action) => {
      const jobId = action.payload;
      const exists = state.bookmarks.find(job => job._id === jobId);
      if (exists) {
        state.bookmarks = state.bookmarks.filter(job => job._id !== jobId);
      } else {
        state.bookmarks.push({ _id: jobId });
      }
    }
  }
});

export const { setBookmarks, toggleBookmarkLocal } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;