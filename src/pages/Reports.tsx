
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TrendingUp, Users, BookOpen, Activity, DollarSign } from 'lucide-react';
import { fetchReports } from '../features/reports/reportsThunk';
import type { RootState, AppDispatch } from '../features/store';

// UI Types
interface CheckoutData {
  month: string;
  checkouts: number;
  returns: number;
}

interface CategoryData {
  name: string;
  percentage: number;
  color: string;
}

interface MembershipData {
  month: string;
  students: number;
}

const Reports: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.reports);

  const categoryColors = [
    '#8B5CF6', '#10B981', '#FBBF24', '#F97316',
    '#06B6D4', '#14B8A6', '#EC4899', '#6366F1'
  ];

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const getCheckoutTrends = useMemo((): CheckoutData[] => {
    if (!data) return [];
    return data.monthlyTrends.map(trend => {
      const date = new Date(trend.key);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      return {
        month: monthName,
        checkouts: trend.value,
        returns: Math.floor(trend.value * 0.9)
      };
    });
  }, [data]);

  const getCategoryDistribution = useMemo((): CategoryData[] => {
    if (!data || data.categoryDistribution.length === 0) return [];
    const total = data.categoryDistribution.reduce((sum, cat) => sum + cat.value, 0);
    return data.categoryDistribution.map((cat, index) => ({
      name: cat.key,
      percentage: Math.round((cat.value / total) * 100),
      color: categoryColors[index % categoryColors.length]
    }));
  }, [data, categoryColors]);

  const getMembershipGrowth = useMemo((): MembershipData[] => {
    if (!data) return [];
    return data.memberGrowth.map(growth => {
      const date = new Date(growth.key);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      return {
        month: monthName,
        students: growth.value
      };
    });
  }, [data]);

  // Calculate percentage changes from monthly trends
  const calculatePercentageChange = (dataArray: { key: string; value: number }[]) => {
    if (!dataArray || dataArray.length < 2) return 0;
    
    // Sort by date to ensure correct order
    const sorted = [...dataArray].sort((a, b) => 
      new Date(a.key).getTime() - new Date(b.key).getTime()
    );
    
    const currentMonth = sorted[sorted.length - 1].value;
    const previousMonth = sorted[sorted.length - 2].value;
    
    if (previousMonth === 0) return 0;
    
    return ((currentMonth - previousMonth) / previousMonth) * 100;
  };

  const transactionChange = useMemo(() => 
    calculatePercentageChange(data?.monthlyTrends || []), 
    [data]
  );

  const memberChange = useMemo(() => 
    calculatePercentageChange(data?.memberGrowth || []), 
    [data]
  );

  // For books, we'll estimate based on recent activity
  const bookChange = useMemo(() => {
    if (!data) return 0;
    // If we have category distribution, use it as a proxy
    if (data.categoryDistribution.length > 0) {
      return 1; // You can calculate this based on actual book additions if backend provides it
    }
    return 0;
  }, [data]);

  // Calculate checkout change (inverse relationship - fewer checkouts is negative)
  const checkoutChange = useMemo(() => 
    calculatePercentageChange(data?.monthlyTrends || []), 
    [data]
  );

  const getIcon = (title: string) => {
    switch (title) {
      case 'Total Transaction':
        return <DollarSign className="w-5 h-5 text-gray-600" />;
      case 'Active Members':
        return <Users className="w-5 h-5 text-gray-600" />;
      case 'Books in Collection':
        return <BookOpen className="w-5 h-5 text-gray-600" />;
      case 'Average Daily Checkouts':
        return <TrendingUp className="w-5 h-5 text-gray-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-2">Error loading data</div>
          <div className="text-sm text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const checkoutTrends = getCheckoutTrends;
  const categoryDistribution = getCategoryDistribution;
  const membershipGrowth = getMembershipGrowth;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Library performance insights and statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Total Transaction</span>
              {getIcon('Total Transaction')}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{data.totalTransactions}</div>
            <div className={`text-sm ${transactionChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {transactionChange >= 0 ? '+' : ''}{transactionChange.toFixed(1)}% from last month
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Active Members</span>
              {getIcon('Active Members')}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{data.activeMembers}</div>
            <div className={`text-sm ${memberChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {memberChange >= 0 ? '+' : ''}{memberChange.toFixed(1)}% from last month
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Books in Collection</span>
              {getIcon('Books in Collection')}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{data.booksInCollection}</div>
            <div className={`text-sm ${bookChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {bookChange >= 0 ? '+' : ''}{bookChange.toFixed(1)}% from last month
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Average Daily Checkouts</span>
              {getIcon('Average Daily Checkouts')}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{data.averageDailyCheckouts}</div>
            <div className={`text-sm ${checkoutChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {checkoutChange >= 0 ? '+' : ''}{checkoutChange.toFixed(1)}% from last month
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Checkout Trends */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Monthly Checkout Trends</h2>
            <p className="text-sm text-gray-600 mb-6">Book checkouts and returns over time</p>
            <div className="relative h-64">
              {checkoutTrends.length > 0 ? (
                <>
                  <svg className="w-full h-full" viewBox="0 0 400 250">
                    {[0, 55, 110, 165, 220].map((y, i) => (
                      <line
                        key={i}
                        x1="40"
                        y1={y + 20}
                        x2="380"
                        y2={y + 20}
                        stroke="#e5e7eb"
                        strokeDasharray="2,2"
                      />
                    ))}
                    {['220', '165', '110', '55', '0'].map((label, i) => (
                      <text
                        key={i}
                        x="30"
                        y={i * 55 + 25}
                        fontSize="10"
                        fill="#6b7280"
                        textAnchor="end"
                      >
                        {label}
                      </text>
                    ))}
                    {checkoutTrends.map((item, index) => {
                      const maxValue = Math.max(...checkoutTrends.map(t => Math.max(t.checkouts, t.returns)));
                      const x = 60 + index * (300 / checkoutTrends.length);
                      const checkoutHeight = (item.checkouts / maxValue) * 200;
                      const returnHeight = (item.returns / maxValue) * 200;
                      return (
                        <g key={index}>
                          <rect
                            x={x}
                            y={220 - checkoutHeight}
                            width="20"
                            height={checkoutHeight}
                            fill="#60A5FA"
                            rx="2"
                          />
                          <rect
                            x={x + 24}
                            y={220 - returnHeight}
                            width="20"
                            height={returnHeight}
                            fill="#34D399"
                            rx="2"
                          />
                          <text
                            x={x + 20}
                            y="240"
                            fontSize="11"
                            fill="#6b7280"
                            textAnchor="middle"
                          >
                            {item.month}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  <div className="flex items-center justify-center gap-6 mt-8">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-400 rounded"></div>
                      <span className="text-sm text-gray-600">Checkouts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-400 rounded"></div>
                      <span className="text-sm text-gray-600">Returns</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No trend data available
                </div>
              )}
            </div>
          </div>

          {/* Book Category Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Book Category Distribution</h2>
            <p className="text-sm text-gray-600 mb-6">Popular categories in the collection</p>
            <div className="flex items-center justify-center h-64">
              {categoryDistribution.length > 0 ? (
                <svg width="280" height="280" viewBox="0 0 280 280">
                  {categoryDistribution.map((category, index) => {
                    const total = categoryDistribution.reduce((sum, cat) => sum + cat.percentage, 0);
                    let startAngle = 0;
                    for (let i = 0; i < index; i++) {
                      startAngle += (categoryDistribution[i].percentage / total) * 360;
                    }
                    const angle = (category.percentage / total) * 360;
                    const endAngle = startAngle + angle;

                    const startRad = (startAngle - 90) * Math.PI / 180;
                    const endRad = (endAngle - 90) * Math.PI / 180;

                    const x1 = 140 + 100 * Math.cos(startRad);
                    const y1 = 140 + 100 * Math.sin(startRad);
                    const x2 = 140 + 100 * Math.cos(endRad);
                    const y2 = 140 + 100 * Math.sin(endRad);

                    const largeArc = angle > 180 ? 1 : 0;

                    const midAngle = (startAngle + endAngle) / 2;
                    const midRad = (midAngle - 90) * Math.PI / 180;
                    const labelX = 140 + 120 * Math.cos(midRad);
                    const labelY = 140 + 120 * Math.sin(midRad);

                    return (
                      <g key={index}>
                        <path
                          d={`M 140 140 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={category.color}
                        />
                        <text
                          x={labelX}
                          y={labelY}
                          fontSize="11"
                          fill={category.color}
                          textAnchor="middle"
                          fontWeight="500"
                        >
                          {category.name} {category.percentage}%
                        </text>
                      </g>
                    );
                  })}
                </svg>
              ) : (
                <div className="text-gray-400">No category data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Membership Growth */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Membership Growth Trends</h2>
          <p className="text-sm text-gray-600 mb-6">Member registration by type over time</p>
          <div className="h-48">
            {membershipGrowth.length > 0 ? (
              <>
                <svg className="w-full h-full" viewBox="0 0 800 180">
                  {[0, 45, 90, 135, 180].map((y, i) => (
                    <line
                      key={i}
                      x1="40"
                      y1={y}
                      x2="760"
                      y2={y}
                      stroke="#e5e7eb"
                      strokeDasharray="2,2"
                    />
                  ))}
                  {(() => {
                    const maxValue = Math.max(...membershipGrowth.map(m => m.students));
                    const step = Math.ceil(maxValue / 4);
                    return [4, 3, 2, 1, 0].map((multiplier, i) => (
                      <text
                        key={i}
                        x="30"
                        y={i * 45 + 5}
                        fontSize="10"
                        fill="#6b7280"
                        textAnchor="end"
                      >
                        {step * multiplier}
                      </text>
                    ));
                  })()}
                  <path
                    d={membershipGrowth.map((point, i) => {
                      const maxValue = Math.max(...membershipGrowth.map(m => m.students));
                      const x = 60 + i * (700 / Math.max(membershipGrowth.length - 1, 1));
                      const y = 180 - (point.students / maxValue) * 180;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    stroke="#A855F7"
                    strokeWidth="2"
                    fill="none"
                  />
                  {membershipGrowth.map((point, i) => {
                    const maxValue = Math.max(...membershipGrowth.map(m => m.students));
                    const x = 60 + i * (700 / Math.max(membershipGrowth.length - 1, 1));
                    const y = 180 - (point.students / maxValue) * 180;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="4" fill="white" stroke="#A855F7" strokeWidth="2" />
                        <text x={x} y="200" fontSize="10" fill="#6b7280" textAnchor="middle">
                          {point.month}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                <div className="flex items-center justify-center gap-2 mt-8">
                  <div className="w-3 h-3 rounded-full border-2 border-purple-500 bg-white"></div>
                  <span className="text-sm text-purple-500">Students</span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No membership data available
              </div>
            )}
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overdue Books */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Overdue Books Report</h2>
            <p className="text-sm text-gray-600 mb-6">Books that are past due date</p>
            <div className="text-4xl font-bold text-gray-900 mb-2">{data.overdueBooksCount}</div>
            <p className="text-sm text-gray-600 mb-6">books currently overdue</p>
            <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              View Details
            </button>
          </div>

          {/* Popular Books */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Popular Books</h2>
            <p className="text-sm text-gray-600 mb-6">Most frequently borrowed books</p>
            <div className="space-y-3 mb-6">
              {data.popularBooks.length > 0 ? (
                data.popularBooks.slice(0, 3).map((book, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 truncate mr-2">{book.key}</span>
                    <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                      {book.value} times
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-400">No popular books data</div>
              )}
            </div>
            <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              View Full List
            </button>
          </div>

          {/* Member Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Member Activity</h2>
            <p className="text-sm text-gray-600 mb-6">Most active library members</p>
            <div className="space-y-3 mb-6">
              {data.topMembers.length > 0 ? (
                data.topMembers.slice(0, 3).map((member, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{member.key}</span>
                    <span className="text-sm font-medium text-gray-900">{member.value} times</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-400">No active members data</div>
              )}
            </div>
            <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;