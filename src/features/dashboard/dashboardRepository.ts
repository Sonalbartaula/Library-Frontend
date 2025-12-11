import { getFullDashboardData } from "../../services/dashboardServices";
import type { DashboardData } from "./model";


export class DashboardRepository {
  async fetchDashboardData(): Promise<DashboardData> {
    try {
      const response = await getFullDashboardData();

      console.log("Dashboard API Response:", response);

      // Transform and validate the response data
      return {
        totalBooks: response.totalBooks ?? 0,
        activeMembers: response.activeMembers ?? 0,
        booksIssued: response.booksIssued ?? 0,
        overdueBooks: response.overdueBooks ?? 0,
        booksAddedThisMonth: response.booksAddedThisMonth ?? 0,
        membersJoinedThisMonth: response.membersJoinedThisMonth ?? 0,
        dueSoonCount: response.dueSoonCount ?? 0,
        remindersSent: response.remindersSent ?? 0,
        recentActivities: Array.isArray(response.recentActivities)
          ? response.recentActivities
          : [],
        popularBooks: Array.isArray(response.popularBooks)
          ? response.popularBooks
          : [],
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to load dashboard data";
      throw new Error(errorMessage);
    }
  }
}

// Export singleton instance
export const dashboardRepository = new DashboardRepository();