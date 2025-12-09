import { Card } from "@/components/ui/card";
import { ChevronRight, Calendar, Globe, Car } from "lucide-react";
import { Campaign } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import NPSScoreDisplay from "./NPSScoreDisplay";
import { format } from "date-fns";

interface CampaignCardProps {
  campaign: Campaign;
  onClick: (campaign: Campaign) => void;
}

const languageLabels: Record<string, string> = {
  EN: "English",
  DE: "German",
  AR: "Arabic",
};

export default function CampaignCard({ campaign, onClick }: CampaignCardProps) {
  return (
    <Card
      className="p-6 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-all group shadow-sm"
      onClick={() => onClick(campaign)}
      data-testid={`card-campaign-${campaign.id}`}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-base font-semibold text-gray-900 truncate" data-testid="text-campaign-name">
              {campaign.name}
            </h3>
            <StatusBadge status={campaign.status} />
          </div>
          
          <p className="text-sm text-gray-500 line-clamp-2 mb-4" data-testid="text-campaign-description">
            {campaign.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              <span>{languageLabels[campaign.language]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Car className="h-3.5 w-3.5" />
              <span>{campaign.serviceType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {format(new Date(campaign.startDate), "MMM d")} - {format(new Date(campaign.endDate), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* NPS Score - Big metric with primary color as per design */}
          <div className="text-center">
            <NPSScoreDisplay score={campaign.insights.npsScore} size="lg" />
          </div>
          <ChevronRight 
            className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" 
          />
        </div>
      </div>
    </Card>
  );
}
