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
    <div className="min-h-full bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
              Campaigns
            </h1>
            <p className="text-gray-500 mt-1">Manage and track your NPS campaigns</p>
          </div>
          <Button 
            onClick={handleCreateCampaign} 
            className="bg-primary hover:bg-primary/90 text-white rounded-md"
            data-testid="button-create-campaign"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        {/* Search Bar */}
        {campaigns.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search campaigns by name, language, service type, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 bg-white border-gray-200 rounded-lg h-11 text-gray-900 placeholder:text-gray-400"
              data-testid="input-search"
            />
          </div>
        )}

        {/* Campaign List */}
        {campaigns.length === 0 ? (
          <EmptyState
            title="No campaigns yet"
            description="Get started by creating your first NPS campaign to collect customer feedback and track satisfaction scores."
            actionLabel="Create Campaign"
            onAction={handleCreateCampaign}
          />
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No campaigns match your search.</p>
          </div>
        ) : (
          <div className="grid gap-4" data-testid="campaign-list">
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
