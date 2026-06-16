import { createSlice } from "@reduxjs/toolkit";

const appliedJobsSlice = createSlice({
  name: "appliedJobs",
  initialState: {
    jobs: [],
  },
  reducers: {
    setAppliedJobs: (state, action) => {
      state.jobs = action.payload;
    },
  },
});

export const { setAppliedJobs } = appliedJobsSlice.actions;
export default appliedJobsSlice.reducer;
