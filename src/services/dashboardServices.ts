// src/services/dashboardServices.ts
import api from "../api/authInstance";

// Single, fast, beautiful call — everything in one go
export const getFullDashboardData = async () => {
  const response = await api.get("/Dashboard/summary");

  // The backend now returns clean, ready-to-use data
  return response.data;
};