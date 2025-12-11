import { createAsyncThunk } from '@reduxjs/toolkit';
import { reportsRepository } from './reportsRepository';
import type { ReportData } from './model';


export const fetchReports = createAsyncThunk<ReportData>(
  'reports/fetchReports',
  async () => {
    return await reportsRepository.getReportsAndAnalytics();
  }
);