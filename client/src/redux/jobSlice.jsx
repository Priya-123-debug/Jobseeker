import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminjobs: [],
    searchJobByText: "",
    filters: {
      location: "",
      industry: "",
      salary: ""
    }
  },

  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },

    setAllAdminjobs: (state, action) => {
      state.allAdminjobs = action.payload;
    },

    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },

    setFilters: (state, action) => {
      state.filters = action.payload;
    }
  }
});

export const {
  setAllJobs,
  setAllAdminjobs,
  setSearchJobByText,
  setFilters
} = jobSlice.actions;

export default jobSlice.reducer;