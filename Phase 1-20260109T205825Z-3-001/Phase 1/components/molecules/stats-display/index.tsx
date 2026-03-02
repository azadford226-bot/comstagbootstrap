interface Stat {
  value: string;
  label: string;
}

interface StatsDisplayProps {
  stats?: Stat[];
}

const defaultStats: Stat[] = [
  { value: "500+", label: "organizations" },
  { value: "2000+", label: "Success stories" },
  { value: "40+", label: "Industries" },
];

export default function StatsDisplay({
  stats = defaultStats,
}: StatsDisplayProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-16 md:gap-32 lg:gap-[286px] text-white text-[20px] font-bold">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <p className="text-light-gray">{stat.value}</p>
          <p className="text-light-gray">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
