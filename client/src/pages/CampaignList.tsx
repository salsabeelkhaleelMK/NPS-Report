import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { getCampaigns } from "@/lib/campaignStore";
import { Campaign } from "@/lib/types";
import CampaignCard from "@/components/campaigns/CampaignCard";
import EmptyState from "@/components/campaigns/EmptyState";

export default function CampaignList() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const campaigns = getCampaigns();

  const filteredCampaigns = useMemo(() => {
    if (!searchQuery.trim()) return campaigns;
    
    const query = searchQuery.toLowerCase();
    return campaigns.filter((campaign) =>
      campaign.name.toLowerCase().includes(query) ||
      campaign.description.toLowerCase().includes(query) ||
      campaign.language.toLowerCase().includes(query) ||
      campaign.serviceType.toLowerCase().includes(query) ||
      campaign.status.toLowerCase().includes(query)
    );
  }, [campaigns, searchQuery]);

  const handleCampaignClick = (campaign: Campaign) => {
    setLocation(`/campaigns/${campaign.id}`);
  };

  const handleCreateCampaign = () => {
    setLocation("/campaigns/new");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Campaigns</h1>
          <Button 
            onClick={handleCreateCampaign} 
            className="bg-slate-900"
            data-testid="button-create-campaign"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Campaign
          </Button>
        </div>

        {campaigns.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search campaigns by name, language, service type, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
              data-testid="input-search"
            />
          </div>
        )}

        {campaigns.length === 0 ? (
          <EmptyState
            title="No campaigns yet"
            description="Get started by creating your first NPS campaign to collect customer feedback and track satisfaction scores."
            actionLabel="Create New Campaign"
            onAction={handleCreateCampaign}
          />
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No campaigns match your search.</p>
          </div>
        ) : (
          <div className="space-y-4" data-testid="campaign-list">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onClick={handleCampaignClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
