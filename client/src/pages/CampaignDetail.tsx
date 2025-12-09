import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Settings, Phone, Star, AlertTriangle, BarChart3, Users, TrendingUp } from "lucide-react";
import { getCampaign } from "@/lib/campaignStore";
import { Campaign } from "@/lib/types";
import StatusBadge from "@/components/campaigns/StatusBadge";
import NPSDonutChart from "@/components/campaigns/NPSDonutChart";
import DistributionBar from "@/components/campaigns/DistributionBar";
import InsightsCard from "@/components/campaigns/InsightsCard";
import NPSTrendChart from "@/components/campaigns/NPSTrendChart";
import DetractorCasesTable from "@/components/campaigns/DetractorCasesTable";
import CampaignSettingsDrawer from "../components/campaigns/CampaignSettingsDrawer";

export default function CampaignDetail() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      const c = getCampaign(params.id);
      if (c) {
        setCampaign(c);
      } else {
        setLocation("/campaigns");
      }
    }
  }, [params.id, setLocation]);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const { insights } = campaign;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setLocation("/campaigns")}
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold" data-testid="text-campaign-name">
                    {campaign.name}
                  </h1>
                  <StatusBadge status={campaign.status} />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{campaign.description}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSettingsOpen(true)}
              data-testid="button-edit"
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* LEAD SOURCE INFORMATION */}
        <div>
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Leads Source
            </h3>
            <p className="text-sm text-muted-foreground">{campaign.targetAudience || "No description provided"}</p>
          </Card>
        </div>

        {/* AI CALL RELATED INSIGHTS */}
        <div>
          <InsightsCard
            title="AI Agent Performance"
            icon={<Phone className="h-5 w-5 text-primary" />}
            collapsible
            defaultExpanded={true}
          >
            {!campaign.aiAgentSettings.enabled ? (
              <p className="text-sm text-muted-foreground">AI Agent is not enabled for this campaign.</p>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Calls</p>
                    <p className="text-2xl font-bold">{insights.aiAgentMetrics.totalCalls}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Successful</p>
                    <p className="text-2xl font-bold text-green-600">{insights.aiAgentMetrics.successfulCalls}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Unreachable</p>
                    <p className="text-2xl font-bold text-amber-600">{insights.aiAgentMetrics.unreachable}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg Duration</p>
                    <p className="text-2xl font-bold">
                      {Math.floor(insights.aiAgentMetrics.avgCallDuration / 60)}:{(insights.aiAgentMetrics.avgCallDuration % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
                
                {insights.aiAgentMetrics.escalationReasons.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3">Escalation Reasons</h4>
                    <div className="space-y-2">
                      {insights.aiAgentMetrics.escalationReasons.map((reason) => (
                        <div key={reason.reason} className="flex justify-between text-sm">
                          <span>{reason.reason}</span>
                          <span className="font-medium">{reason.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </InsightsCard>
        </div>

        {/* NON-AI RELATED INSIGHTS */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                NPS Overview
              </h3>
              <NPSDonutChart
                promotersPercent={insights.promotersPercent}
                passivesPercent={insights.passivesPercent}
                detractorsPercent={insights.detractorsPercent}
                npsScore={insights.npsScore}
              />
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold" data-testid="text-response-count">
                    {insights.responseCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Responses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold" data-testid="text-response-rate">
                    {insights.responseRate}%
                  </p>
                  <p className="text-xs text-muted-foreground">Response Rate</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Response Sources
              </h3>
              <div className="space-y-4">
                <DistributionBar 
                  label="Email" 
                  value={Math.round((insights.responseSources.email / insights.responseCount) * 100) || 0} 
                  color="#2563eb"
                  count={insights.responseSources.email}
                />
                <DistributionBar 
                  label="SMS" 
                  value={Math.round((insights.responseSources.sms / insights.responseCount) * 100) || 0} 
                  color="#8b5cf6"
                  count={insights.responseSources.sms}
                />
                <DistributionBar 
                  label="AI Call" 
                  value={Math.round((insights.responseSources.aiCall / insights.responseCount) * 100) || 0} 
                  color="#f59e0b"
                  count={insights.responseSources.aiCall}
                />
              </div>
              
              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="text-sm font-medium mb-4">NPS Trend</h4>
                <NPSTrendChart data={insights.npsOverTime} />
              </div>
            </Card>
          </div>

          <InsightsCard
            title="Review Performance"
            icon={<Star className="h-5 w-5 text-primary" />}
            collapsible
            defaultExpanded={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Review Requests Sent</p>
                <p className="text-2xl font-bold">{insights.reviewPerformance.totalReviewRequestsSent}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Click Rate</p>
                <p className="text-2xl font-bold">{insights.reviewPerformance.clickRate}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Engagement Rate</p>
                <p className="text-2xl font-bold">{insights.reviewPerformance.engagementRate}%</p>
              </div>
            </div>
            
            {insights.reviewPerformance.clicksByChannel.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Clicks by Channel</h4>
                <div className="space-y-3">
                  {insights.reviewPerformance.clicksByChannel.map((item) => (
                    <DistributionBar
                      key={item.channel}
                      label={item.channel}
                      value={Math.round((item.clicks / insights.reviewPerformance.totalReviewRequestsSent) * 100)}
                      color="#2563eb"
                      count={item.clicks}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {insights.reviewPerformance.clicksByPlatform.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Clicks by Platform</h4>
                <div className="space-y-3">
                  {insights.reviewPerformance.clicksByPlatform.map((item) => (
                    <DistributionBar
                      key={item.platform}
                      label={item.platform}
                      value={Math.round((item.clicks / insights.reviewPerformance.totalReviewRequestsSent) * 100)}
                      color="#22c55e"
                      count={item.clicks}
                    />
                  ))}
                </div>
              </div>
            )}
          </InsightsCard>

          <InsightsCard
            title="Detractor Cases"
            icon={<AlertTriangle className="h-5 w-5 text-primary" />}
            collapsible
            defaultExpanded={false}
          >
            <DetractorCasesTable tickets={insights.detractorTickets} />
          </InsightsCard>
        </div>
      </div>

      <CampaignSettingsDrawer
        campaign={campaign}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onSave={(updated: Campaign) => setCampaign(updated)}
      />
    </div>
  );
}
