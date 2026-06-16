import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
  name: "application",
  initialState: {
    applicants: [], // list of applicants
  },
  reducers: {
    // set all applicants when fetching from backend
    setAllApplicants: (state, action) => {
      state.applicants = action.payload;
    },

    // update the status of a single applicant
    updateApplicantStatus: (state, action) => {
      const { id, status } = action.payload;
      state.applicants = state.applicants.map(app =>
        app._id === id ? { ...app, status } : app
      );
    },
  },
});

export const { setAllApplicants, updateApplicantStatus } = applicationSlice.actions;
export default applicationSlice.reducer;
