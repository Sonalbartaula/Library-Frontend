import { useEffect, useState } from "react";
import PopularBooks from "../components/sections/PopularBooks";
import RecentActivity from "../components/sections/RecentActivity";
import { getFullDashboardData } from "../services/dashboardServices";
import { BookOpen, Users, BookMarked, AlertTriangle } from "lucide-react";

interface DashboardData {
  totalBooks: number;
  activeMembers: number;
  booksIssued: number;
  overdueBooks: number;
  booksAddedThisMonth: number;
  membersJoinedThisMonth: number;
  dueSoonCount: number;
  remindersSent: number;
  recentActivities: any[];
  popularBooks: any[];
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getFullDashboardData();

        console.log("Dashboard API Response:", res);

        setData({
          totalBooks: res.totalBooks ?? 0,
          activeMembers: res.activeMembers ?? 0,
          booksIssued: res.booksIssued ?? 0,
          overdueBooks: res.overdueBooks ?? 0,
          booksAddedThisMonth: res.booksAddedThisMonth ?? 0,
          membersJoinedThisMonth: res.membersJoinedThisMonth ?? 0,
          dueSoonCount: res.dueSoonCount ?? 0,
          remindersSent: res.remindersSent ?? 0,
          recentActivities: Array.isArray(res.recentActivities) ? res.recentActivities : [],
          popularBooks: Array.isArray(res.popularBooks) ? res.popularBooks : [],
        });
      } catch (err: any) {
        console.error("Failed to load dashboard:", err);
        setError(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="h-12 bg-gray-300 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                  <div className="h-5 bg-gray-200 rounded w-28"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-2xl mx-auto">
          <p className="font-semibold">Error Loading Dashboard</p>
          <p className="text-sm mt-1">{error || "No data available"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div >
        <h1 className="text-3xl font-bold text-gray-900">Library Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to the Library Management System</p>
      </div>

      {/* Stats Cards - 100% Real Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Books */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Books</p>
              <p className="text-4xl font-bold text-gray-900 mt-3">{data.totalBooks.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-4">Available in Library</p>
              <p className="text-sm font-semibold text-green-600 mt-2">
                + {data.booksAddedThisMonth} this month
              </p>
            </div>
            <BookOpen className="text-gray-400" size={30} />
          </div>
        </div>

        {/* Active Members */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Members</p>
              <p className="text-4xl font-bold text-gray-900 mt-3">{data.activeMembers.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-4">Registered members</p>
              <p className="text-sm font-semibold text-green-600 mt-2">
                + {data.membersJoinedThisMonth} this month
              </p>
            </div>
            <Users className="text-gray-400" size={30} />
          </div>
        </div>

        {/* Books Issued */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Books Issued</p>
              <p className="text-4xl font-bold text-gray-900 mt-3">{data.booksIssued.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-4">Currently Checked out</p>
              <p className="text-sm font-semibold text-green-600 mt-2">
                {data.dueSoonCount} due soon
              </p>
            </div>
            <BookMarked className="text-gray-400" size={30} />
          </div>
        </div>

        {/* Overdue Books */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Overdue Books</p>
              <p className="text-4xl font-bold text-red-600 mt-3">{data.overdueBooks}</p>
              <p className="text-sm text-gray-600 mt-4">Need Attention</p>
              <p className="text-sm font-semibold text-green-600 mt-2">
                Return reminder sent
              </p>
            </div>
            <AlertTriangle className="text-red-500" size={30} />
          </div>
        </div>
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={data.recentActivities} />
        <PopularBooks books={data.popularBooks} />
      </div>
    </div>
  );
};

export default Dashboard;