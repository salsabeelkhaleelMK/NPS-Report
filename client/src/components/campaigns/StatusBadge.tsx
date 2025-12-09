import { Badge } from "@/components/ui/badge";
import { CampaignStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: CampaignStatus;
}

// Soft style badges as per design system
const statusConfig: Record<CampaignStatus, { className: string; label: string }> = {
  Active: { 
    className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100", 
    label: "Active" 
  },
  Paused: { 
    className: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100", 
    label: "Paused" 
  },
  Draft: { 
    className: "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100", 
    label: "Draft" 
  },
  Completed: { 
    className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100", 
    label: "Completed" 
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="outline"
      className={`${config.className} text-xs font-medium px-2.5 py-0.5 rounded-md`}
      data-testid={`badge-status-${status.toLowerCase()}`}
    >
      {config.label}
    </Badge>
  );
}
