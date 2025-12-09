import { Badge } from "@/components/ui/badge";
import { CampaignStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: CampaignStatus;
}

const statusConfig: Record<CampaignStatus, { className: string; label: string }> = {
  Active: { className: "bg-green-500 text-white border-green-600", label: "Active" },
  Paused: { className: "bg-amber-500 text-white border-amber-600", label: "Paused" },
  Draft: { className: "bg-slate-400 text-white border-slate-500", label: "Draft" },
  Completed: { className: "bg-blue-500 text-white border-blue-600", label: "Completed" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      className={`${config.className} text-xs font-medium`}
      data-testid={`badge-status-${status.toLowerCase()}`}
    >
      {config.label}
    </Badge>
  );
}
