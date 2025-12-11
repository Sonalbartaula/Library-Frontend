// ← Use configured api instance
import api from '../../api/authInstance';
import type { ReportData } from './model';

const BASE_URL = '/Report'; // ← Simplified, baseURL already in api instance

export const reportsRepository = {
  async getReportsAndAnalytics(): Promise<ReportData> {
    const response = await api.get<ReportData>(
      `${BASE_URL}/ReportsAndAnalytics`
    );
    return response.data;
  }
};