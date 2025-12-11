import { createSlice } from "@reduxjs/toolkit";
import { initialDashboardState } from "./model";
import type { RootState } from "../store";
import { fetchDashboardData } from "./dashboardThunk";


const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialDashboardState,
  reducers: {
    // Clear dashboard data
    clearDashboard: (state) => {
      state.data = null;
      state.error = null;
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Data
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load dashboard data";
      });
  },
});

// Actions
export const { clearDashboard, clearError } = dashboardSlice.actions;

// Selectors
export const selectDashboardData = (state: RootState) => state.dashboard.data;
export const selectDashboardLoading = (state: RootState) => state.dashboard.loading;
export const selectDashboardError = (state: RootState) => state.dashboard.error;

// Reducer
export default dashboardSlice.reducer;