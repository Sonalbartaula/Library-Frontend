export interface DashboardData {
  totalBooks: number;
  activeMembers: number;
  booksIssued: number;
  overdueBooks: number;
  booksAddedThisMonth: number;
  membersJoinedThisMonth: number;
  dueSoonCount: number;
  remindersSent: number;
  recentActivities: Activity[];
  popularBooks: PopularBook[];
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user?: string;
}

export interface PopularBook {
  id: number;
  title: string;
  author: string;
  isbn: string;
  categories: string;
  totalCopies: number;
  issuedCopies: number;
  status: number;
  addedDate: string;
}

export interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

export const initialDashboardState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};