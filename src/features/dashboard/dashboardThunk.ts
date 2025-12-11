import { createAsyncThunk } from "@reduxjs/toolkit";
import type { DashboardData } from "./model";
import { dashboardRepository } from "./dashboardRepository";


/**
 * Async thunk to fetch dashboard data
 */
export const fetchDashboardData = createAsyncThunk<
  DashboardData,
  void,
  { rejectValue: string }
>(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const data = await dashboardRepository.fetchDashboardData();
      return data;
    } catch (error: any) {
      console.error("Failed to load dashboard:", error);
      return rejectWithValue(error.message || "Failed to load dashboard data");
    }
  }
);