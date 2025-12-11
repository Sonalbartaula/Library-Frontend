import React from 'react';

interface Activity {
  type?: number | string;
  title?: string;
  subtitle?: string;
  date?: string;
  timestamp?: string;
  createdAt?: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  // Map enum numbers to activity type strings
  const activityTypeMap: { [key: number]: string } = {
    0: 'Book Added',
    1: 'Book Issued',
    2: 'Book Returned',
    3: 'New Member',
    4: 'Book Renew'
  };

  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return 'Recently';

    // If timestamp is already in relative format
    if (timestamp.includes('ago') || timestamp.includes('min') || timestamp.includes('hours')) {
      return timestamp;
    }

    try {
      const now = new Date();
      const activityTime = new Date(timestamp);
      
      // Check if date is valid
      if (isNaN(activityTime.getTime())) {
        return 'Recently';
      }

      const diffMs = now.getTime() - activityTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) {
        return 'just now';
      } else if (diffMins < 60) {
        return `${diffMins} min ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hours ago`;
      } else if (diffDays < 30) {
        return `${diffDays} days ago`;
      } else {
        return activityTime.toLocaleDateString();
      }
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Recently';
    }
  };

  // Helper to get the right field value
  const getActivityType = (activity: Activity) => {
    const rawType = activity.type;
    
    // If it's a number (enum value), convert to string
    if (typeof rawType === 'number') {
      return activityTypeMap[rawType] || 'Activity';
    }
    
    // If it's already a string, return it
    return rawType || 'Activity';
  };

  const getDescription = (activity: Activity) => {
    return activity.title || '';
  };

  const getDetails = (activity: Activity) => {
    return activity.subtitle || '';
  };

  const getTimestamp = (activity: Activity) => {
    return activity.date || activity.timestamp || activity.createdAt;
  };

  console.log('Activities received:', activities);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-500 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
        <p className="text-blue-50 text-sm mt-1">Latest library transactions and updates</p>
      </div>

      {/* Activities List */}
      <div className="divide-y divide-gray-100">
        {activities && activities.length > 0 ? (
          activities.map((activity, index) => {
            const activityType = getActivityType(activity);
            const description = getDescription(activity);
            const details = getDetails(activity);
            const timestamp = getTimestamp(activity);

            return (
              <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base">{activityType}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <span>{description}</span>
                      {details && (
                        <>
                          <span>•</span>
                          <span>{details}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 shrink-0">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTimestamp(timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="px-6 py-8 text-center text-gray-500">
            No recent activity available
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;