import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  iconBgColor?: string;
  iconTextColor?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  iconBgColor = "bg-primary",
  iconTextColor = "text-white",
}: StatCardProps) {
  return (
    <div className="bg-off-white rounded-lg p-6 border border-light-gray">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center`}
        >
          <div className={`w-6 h-6 ${iconTextColor}`}>{icon}</div>
        </div>
        <div>
          <p className="text-text-body text-sm">{label}</p>
          <p className="text-2xl font-semibold text-primary-dark">{value}</p>
        </div>
      </div>
    </div>
  );
}
