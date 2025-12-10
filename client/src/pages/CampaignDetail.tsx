import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Settings, Phone, Star, AlertTriangle, BarChart3, Users, TrendingUp, List } from "lucide-react";
import { getCampaign } from "@/lib/campaignStore";
import { Campaign } from "@/lib/types";
import StatusBadge from "@/components/campaigns/StatusBadge";
import NPSDonutChart from "@/components/campaigns/NPSDonutChart";
import DistributionBar from "@/components/campaigns/DistributionBar";
import InsightsCard from "@/components/campaigns/InsightsCard";
import NPSTrendChart from "@/components/campaigns/NPSTrendChart";
import DetractorCasesTable from "@/components/campaigns/DetractorCasesTable";
import CampaignSettingsDrawer from "../components/campaigns/CampaignSettingsDrawer";
import AIAgentLiveStatus from "@/components/campaigns/AIAgentLiveStatus";
import CampaignLog from "@/components/campaigns/CampaignLog";

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
      <div className="min-h-full bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const { insights } = campaign;

  return (
    <div className="min-h-full bg-gray-50">
      {/* Page Header - White background with border */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setLocation("/campaigns")}
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-gray-900" data-testid="text-campaign-name">
                    {campaign.name}
                  </h1>
                  <StatusBadge status={campaign.status} />
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{campaign.description}</p>
              </div>
            </div>
            {/* Settings button with primary (burnt orange) color */}
            <Button 
              onClick={() => setSettingsOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white rounded-md"
              data-testid="button-edit"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Light gray background */}
      <div className="max-w-6xl mx-auto px-8 py-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="relative mb-6">
            {/* Bottom border line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300 z-0" />
            
            <TabsList className="bg-transparent border-0 p-0 h-auto gap-0 relative z-10">
              <TabsTrigger 
                value="dashboard" 
                className="relative px-6 py-3 bg-white text-gray-600 font-medium transition-all border-2 border-b-0 border-gray-300 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:border-red-600 data-[state=active]:z-20 data-[state=active]:shadow-[0_-4px_6px_rgba(0,0,0,0.1)] data-[state=inactive]:hover:bg-gray-50 data-[state=inactive]:z-10 data-[state=inactive]:border-gray-300"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",
                  marginBottom: "-2px",
                }}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="log"
                className="relative px-6 py-3 bg-white text-gray-600 font-medium transition-all border-2 border-b-0 border-gray-300 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:border-red-600 data-[state=active]:z-20 data-[state=active]:shadow-[0_-4px_6px_rgba(0,0,0,0.1)] data-[state=inactive]:hover:bg-gray-50 data-[state=inactive]:z-10 data-[state=inactive]:border-gray-300"
                style={{
                  clipPath: "polygon(20px 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%, 0 20px)",
                  marginBottom: "-2px",
                  marginLeft: "-2px",
                }}
              >
                <List className="h-4 w-4 mr-2" />
                Campaign Log
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-6 mt-0">
        {/* LEAD SOURCE INFORMATION */}
            <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Leads Source
            </h3>
              <p className="text-sm text-gray-500">{campaign.targetAudience || "No description provided"}</p>
          </Card>

        {/* AI CALL RELATED INSIGHTS */}
            {campaign.aiAgentSettings.enabled && (
              <AIAgentLiveStatus campaignId={campaign.id} />
            )}

          <InsightsCard
              title="History"
              icon={<Phone className="h-5 w-5" />}
            collapsible
            defaultExpanded={true}
          >
            {!campaign.aiAgentSettings.enabled ? (
                <p className="text-sm text-gray-500">AI Agent is not enabled for this campaign.</p>
            ) : (
              <>
                  {/* Metrics grid with big numbers */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div>
                      <p className="text-sm text-gray-400 mb-1 uppercase tracking-wider">Total Calls</p>
                      <p className="text-3xl font-bold text-gray-900">{insights.aiAgentMetrics.totalCalls}</p>
                  </div>
                  <div>
                      <p className="text-sm text-gray-400 mb-1 uppercase tracking-wider">Successful</p>
                      <p className="text-3xl font-bold text-green-600">{insights.aiAgentMetrics.successfulCalls}</p>
                  </div>
                  <div>
                      <p className="text-sm text-gray-400 mb-1 uppercase tracking-wider">Unreachable</p>
                      <p className="text-3xl font-bold text-amber-600">{insights.aiAgentMetrics.unreachable}</p>
                  </div>
                  <div>
                      <p className="text-sm text-gray-400 mb-1 uppercase tracking-wider">Avg Duration</p>
                      <p className="text-3xl font-bold text-gray-900">
                      {Math.floor(insights.aiAgentMetrics.avgCallDuration / 60)}:{(insights.aiAgentMetrics.avgCallDuration % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
                
                {insights.aiAgentMetrics.escalationReasons.length > 0 && (
                    <div className="pt-6 border-t border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Escalation Reasons</h4>
                      <div className="space-y-3">
                      {insights.aiAgentMetrics.escalationReasons.map((reason) => (
                        <div key={reason.reason} className="flex justify-between text-sm">
                            <span className="text-gray-600">{reason.reason}</span>
                            <span className="font-semibold text-gray-900">{reason.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </InsightsCard>

            {/* NON-AI RELATED INSIGHTS - Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* NPS Overview Card */}
              <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                NPS Overview
              </h3>
              <NPSDonutChart
                promotersPercent={insights.promotersPercent}
                passivesPercent={insights.passivesPercent}
                detractorsPercent={insights.detractorsPercent}
                npsScore={insights.npsScore}
              />
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900" data-testid="text-response-count">
                    {insights.responseCount}
                  </p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Responses</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900" data-testid="text-response-rate">
                    {insights.responseRate}%
                  </p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Response Rate</p>
                </div>
              </div>
            </Card>

              {/* Response Sources Card */}
              <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Response Sources
              </h3>
              <div className="space-y-4">
                  {/* Progress bars with design system colors */}
                <DistributionBar 
                  label="Email" 
                  value={Math.round((insights.responseSources.email / insights.responseCount) * 100) || 0} 
                    color="#3B82F6"
                  count={insights.responseSources.email}
                />
                <DistributionBar 
                  label="SMS" 
                  value={Math.round((insights.responseSources.sms / insights.responseCount) * 100) || 0} 
                    color="#A855F7"
                  count={insights.responseSources.sms}
                />
                <DistributionBar 
                  label="AI Call" 
                  value={Math.round((insights.responseSources.aiCall / insights.responseCount) * 100) || 0} 
                    color="#F97316"
                  count={insights.responseSources.aiCall}
                />
              </div>
              
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">NPS Trend</h4>
                <NPSTrendChart data={insights.npsOverTime} />
              </div>
            </Card>
          </div>

            {/* Review Performance */}
          <InsightsCard
            title="Review Performance"
              icon={<Star className="h-5 w-5" />}
            collapsible
            defaultExpanded={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                  <p className="text-sm text-gray-400 mb-1 uppercase tracking-wider">Review Requests Sent</p>
                  <p className="text-3xl font-bold text-gray-900">{insights.reviewPerformance.totalReviewRequestsSent}</p>
              </div>
              <div>
                  <p className="text-sm text-gray-400 mb-1 uppercase tracking-wider">Click Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{insights.reviewPerformance.clickRate}%</p>
              </div>
              <div>
                  <p className="text-sm text-gray-400 mb-1 uppercase tracking-wider">Engagement Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{insights.reviewPerformance.engagementRate}%</p>
              </div>
            </div>
            
            {insights.reviewPerformance.clicksByChannel.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Clicks by Channel</h4>
                  <div className="space-y-4">
                  {insights.reviewPerformance.clicksByChannel.map((item) => (
                    <DistributionBar
                      key={item.channel}
                      label={item.channel}
                      value={Math.round((item.clicks / insights.reviewPerformance.totalReviewRequestsSent) * 100)}
                        color="#3B82F6"
                      count={item.clicks}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {insights.reviewPerformance.clicksByPlatform.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Clicks by Platform</h4>
                  <div className="space-y-4">
                  {insights.reviewPerformance.clicksByPlatform.map((item) => (
                    <DistributionBar
                      key={item.platform}
                      label={item.platform}
                      value={Math.round((item.clicks / insights.reviewPerformance.totalReviewRequestsSent) * 100)}
                        color="#4CAF50"
                      count={item.clicks}
                    />
                  ))}
                </div>
              </div>
            )}
          </InsightsCard>

            {/* Detractor Cases */}
          <InsightsCard
            title="Detractor Cases"
              icon={<AlertTriangle className="h-5 w-5" />}
            collapsible
            defaultExpanded={false}
          >
            <DetractorCasesTable tickets={insights.detractorTickets} />
          </InsightsCard>
          </TabsContent>

          <TabsContent value="log" className="mt-0">
            <CampaignLog campaignId={campaign.id} />
          </TabsContent>
        </Tabs>
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
