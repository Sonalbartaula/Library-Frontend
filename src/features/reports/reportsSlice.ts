import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { fetchReports } from './reportsThunk';
import type { ReportData } from './model';

interface ReportsState {
  data: ReportData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  data: null,
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action: PayloadAction<ReportData>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reports';
      });
  }
});

export const { clearError } = reportsSlice.actions;
export default reportsSlice.reducer;