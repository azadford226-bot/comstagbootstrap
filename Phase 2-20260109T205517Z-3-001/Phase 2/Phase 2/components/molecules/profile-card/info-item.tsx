import React from "react";
import {
  BriefcaseIcon,
  UsersIcon,
  CalendarIcon,
  LocationIcon,
  GlobeIcon,
} from "@/components/atoms/icon";

interface InfoItemProps {
  icon: "briefcase" | "users" | "calendar" | "location" | "globe";
  children: React.ReactNode;
}

const iconMap = {
  briefcase: BriefcaseIcon,
  users: UsersIcon,
  calendar: CalendarIcon,
  location: LocationIcon,
  globe: GlobeIcon,
};

export const InfoItem: React.FC<InfoItemProps> = ({ icon, children }) => {
  const Icon = iconMap[icon];

  return (
    <div className="flex items-center gap-2 text-text-body">
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </div>
  );
};
