interface StatsCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
}

const StatsCard = ({ title, value, icon, color = "bg-blue-500" }: StatsCardProps) => (
  <div className={`flex items-center justify-between p-4 rounded-xl shadow-md ${color} text-white`}>
    <div>
      <h3 className="text-sm">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
    {icon && <div className="text-3xl">{icon}</div>}
  </div>
);

export default StatsCard;
