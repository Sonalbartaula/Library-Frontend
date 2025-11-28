interface RecentActivityProps {
  activities: { id: number; memberName: string; bookTitle: string; date: string }[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => (
  <div className="bg-white p-6 rounded-xl shadow-md w-full">
    <div className="bg-[#3D89D6] w-full ">
    <h2 className="text-white text-xl font-semibold mb-1">Recent Activity</h2>
    <p className="text-white">latest library transaction and updates</p>
    </div>
    <ul className="">
      {activities.map((a) => (
        <li key={a.id} className="py-2">
          <span className="font-medium">{a.memberName}</span> issued <span className="font-semibold">{a.bookTitle}</span> on {a.date}
        </li>
      ))}
    </ul>
  </div>
);

export default RecentActivity;
