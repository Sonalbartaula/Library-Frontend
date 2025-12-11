export interface KeyValuePair {
  key: string;
  value: number;
}

export interface ReportData {
  totalTransactions: number;
  activeMembers: number;
  booksInCollection: number;
  averageDailyCheckouts: number;
  monthlyTrends: KeyValuePair[];
  categoryDistribution: KeyValuePair[];
  memberGrowth: KeyValuePair[];
  overdueBooksCount: number;
  popularBooks: KeyValuePair[];
  topMembers: KeyValuePair[];
}