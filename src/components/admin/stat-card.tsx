interface StatCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: string;
}

export function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-midnight-soft rounded-[var(--radius-lg)] p-6 border border-midnight-elev">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{label}</p>
        {icon && <div className="text-terracotta">{icon}</div>}
      </div>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
      {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
    </div>
  );
}
