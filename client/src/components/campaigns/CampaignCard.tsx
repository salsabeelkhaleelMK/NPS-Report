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
      className="p-4 cursor-pointer hover-elevate active-elevate-2 transition-all group"
      onClick={() => onClick(campaign)}
      data-testid={`card-campaign-${campaign.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base font-semibold truncate" data-testid="text-campaign-name">
              {campaign.name}
            </h3>
            <StatusBadge status={campaign.status} />
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3" data-testid="text-campaign-description">
            {campaign.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>{languageLabels[campaign.language]}</span>
            </div>
            <div className="flex items-center gap-1">
              <Car className="h-3 w-3" />
              <span>{campaign.serviceType}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {format(new Date(campaign.startDate), "MMM d")} - {format(new Date(campaign.endDate), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <NPSScoreDisplay score={campaign.insights.npsScore} size="md" />
          <ChevronRight 
            className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" 
          />
        </div>
      </div>
    </Card>
  );
}
