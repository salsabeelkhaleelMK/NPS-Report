import CampaignCard from '../campaigns/CampaignCard';
import { Campaign } from '@/lib/types';

// todo: remove mock functionality
const mockCampaign: Campaign = {
  id: "1",
  name: "Q4 Customer Satisfaction Survey",
  description: "Annual customer satisfaction survey for all new vehicle purchases in Q4",
  language: "EN",
  serviceType: "New Vehicle Purchase",
  status: "Active",
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  targetAudience: "New vehicle buyers",
  triggerType: "Delayed",
  delayHours: 48,
  dataSource: "CRM Database",
  surveyQuestions: [],
  followUpSteps: [],
  messageTemplates: { email: { subject: "", body: "" }, sms: { body: "" }, whatsapp: { template: "" } },
  reviewChannels: [],
  outcomeRules: { detractors: { createFidsparkDispute: true, createLeadsparkTask: false, createWebhookTask: false, webhookUrl: "", webhookSecret: "", webhookPayloadTemplate: "" }, promoters: { promptReviewChannels: true }, passives: { noAction: true } },
  aiAgentSettings: { enabled: true, startAfterHours: 24, retryIntervalHours: 4, callWindowFrom: "09:00", callWindowTo: "18:00", maxRetries: 3, voiceType: "Female 1", personaScript: "", triggerHumanFollowUpOnFailure: true, triggerHumanFollowUpOnDissatisfaction: true, triggerHumanFollowUpOnVerbalComplaint: true },
  insights: { npsScore: 72, responseCount: 245, responseRate: 34.5, promotersPercent: 58, passivesPercent: 22, detractorsPercent: 20, responseSources: { email: 145, sms: 62, aiCall: 38 }, npsOverTime: [], aiAgentMetrics: { totalCalls: 156, successfulCalls: 124, unreachable: 32, avgCallDuration: 180, escalationReasons: [] }, reviewPerformance: { totalReviewRequestsSent: 142, clickRate: 28.5, clicksByChannel: [], clicksByPlatform: [], engagementRate: 42.3, engagementTrend: [] }, detractorTickets: [] },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function CampaignCardExample() {
  return (
    <CampaignCard campaign={mockCampaign} onClick={(c) => console.log('Clicked:', c.name)} />
  );
}
