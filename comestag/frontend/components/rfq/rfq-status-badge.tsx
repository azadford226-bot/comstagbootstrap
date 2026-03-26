import type { LucideIcon } from "lucide-react";
import { Globe, Eye, CheckCircle, Lock, AlertCircle } from "lucide-react";

export const RFQ_STATUS_CONFIG: Record<
  string,
  { label: string; className: string; icon: LucideIcon; step: number }
> = {
  OPEN: {
    label: "Open",
    className: "bg-green-100 text-green-800 border-green-200",
    icon: Globe,
    step: 1,
  },
  REVIEW: {
    label: "In Review",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Eye,
    step: 2,
  },
  AWARDED: {
    label: "Awarded",
    className: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle,
    step: 3,
  },
  CLOSED: {
    label: "Closed",
    className: "bg-gray-100 text-gray-800 border-gray-200",
    icon: Lock,
    step: 4,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 border-red-200",
    icon: AlertCircle,
    step: 0,
  },
};

export function rfqStatusLabel(status: string): string {
  return RFQ_STATUS_CONFIG[status]?.label ?? status;
}

export function rfqStatusClassName(status: string): string {
  return RFQ_STATUS_CONFIG[status]?.className ?? "bg-gray-100 text-gray-800 border-gray-200";
}

type Props = {
  status: string;
  showIcon?: boolean;
  className?: string;
};

/** Single source for RFQ lifecycle labels + styling (list + detail + proposals). */
export function RfqStatusBadge({ status, showIcon = false, className = "" }: Props) {
  const cfg = RFQ_STATUS_CONFIG[status];
  const Icon = cfg?.icon ?? AlertCircle;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${rfqStatusClassName(status)} ${className}`}
    >
      {showIcon && <Icon className="w-3 h-3 shrink-0" aria-hidden />}
      {rfqStatusLabel(status)}
    </span>
  );
}
