/**
 * Mock/Seed Data - Isolated from business logic
 * 
 * BEST PRACTICE: Keep sample data in a separate file from store operations.
 * This allows for:
 * - Easy swapping between mock and real API data
 * - Clear separation of concerns
 * - Simpler testing with controlled data
 * - Easy removal when connecting to a real backend
 */

import { Campaign, DEFAULT_QUESTIONS } from './types';
import { v4 as uuidv4 } from 'uuid';

// Base templates that can be reused across campaigns
const baseMessageTemplates = {
  email: {
    subject: "We'd love your feedback!",
    body: "Dear {{customerName}}, thank you for choosing us. Please take a moment to share your experience.",
  },
  sms: {
    body: "Hi {{customerName}}! Rate your experience: {{surveyLink}}",
  },
  whatsapp: {
    template: "Hello {{customerName}}, we value your opinion. Click here to share feedback: {{surveyLink}}",
  },
};

const baseOutcomeRules = {
  detractors: {
    createFidsparkDispute: true,
    createLeadsparkTask: false,
    createWebhookTask: false,
    webhookUrl: "",
    webhookSecret: "",
    webhookPayloadTemplate: "",
  },
  promoters: {
    promptReviewChannels: true,
  },
  passives: {
    noAction: true,
  },
};

const baseReviewChannels = [
  { id: "rc1", platform: "Google" as const, priority: 1, enabled: true },
  { id: "rc2", platform: "Facebook" as const, priority: 2, enabled: true },
  { id: "rc3", platform: "AutoScout24" as const, priority: 3, enabled: false },
  { id: "rc4", platform: "mobile.de" as const, priority: 4, enabled: false },
];

const baseAISettings = {
  enabled: true,
  startAfterHours: 24,
  retryIntervalHours: 4,
  callWindowFrom: "09:00",
  callWindowTo: "18:00",
  maxRetries: 3,
  voiceType: "Female 1" as const,
  personaScript: "Hello, this is Sarah from AutoHaus. I'm calling to follow up on your recent visit and gather your feedback.",
  triggerHumanFollowUpOnFailure: true,
  triggerHumanFollowUpOnDissatisfaction: true,
  triggerHumanFollowUpOnVerbalComplaint: true,
};

const baseFollowUpSteps = [
  { id: "fs1", order: 1, actionType: "Send Email" as const, delayDays: 0, configuration: {} },
  { id: "fs2", order: 2, actionType: "Send SMS" as const, delayDays: 2, configuration: {} },
  { id: "fs3", order: 3, actionType: "Send AI Call" as const, delayDays: 5, configuration: {} },
];

// Empty insights template for new/draft campaigns
export const emptyInsights = {
  npsScore: 0,
  responseCount: 0,
  responseRate: 0,
  promotersPercent: 0,
  passivesPercent: 0,
  detractorsPercent: 0,
  responseSources: { email: 0, sms: 0, aiCall: 0 },
  npsOverTime: [],
  aiAgentMetrics: {
    totalCalls: 0,
    successfulCalls: 0,
    unreachable: 0,
    avgCallDuration: 0,
    escalationReasons: [],
  },
  reviewPerformance: {
    totalReviewRequestsSent: 0,
    clickRate: 0,
    clicksByChannel: [],
    clicksByPlatform: [],
    engagementRate: 0,
    engagementTrend: [],
  },
  detractorTickets: [],
};

/**
 * Creates seed campaigns for demo/development purposes
 * This function generates dynamic dates relative to "now" for realistic demo data
 */
export const createSeedCampaigns = (): Campaign[] => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const thirtyDaysFuture = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysFuture = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  return [
    {
      id: uuidv4(),
      name: "AI Retry Only",
      description: "AI-driven retry campaign using only phone calls with external question source integration",
      language: "EN",
      serviceType: "New Vehicle Purchase",
      status: "Active",
      startDate: thirtyDaysAgo,
      endDate: tomorrow,
      targetAudience: "Leads from external CRM system - retry candidates",
      triggerType: "Delayed",
      delayHours: 24,
      dataSource: "External CRM - Lead Retry Queue",
      questionSourceType: "external" as const,
      externalQuestionSourceUrl: "https://api.external-crm.com/survey-questions",
      surveyQuestions: DEFAULT_QUESTIONS["New Vehicle Purchase"],
      followUpSteps: [
        { id: "fs-ai-retry", order: 1, actionType: "Send AI Call" as const, delayDays: 0, configuration: {} },
      ],
      messageTemplates: {
        email: { subject: "", body: "" },
        sms: { body: "" },
        whatsapp: { template: "" },
      },
      reviewChannels: baseReviewChannels,
      outcomeRules: {
        detractors: {
          createFidsparkDispute: false,
          createLeadsparkTask: false,
          createWebhookTask: false,
          webhookUrl: "",
          webhookSecret: "",
          webhookPayloadTemplate: "",
        },
        promoters: { promptReviewChannels: false },
        passives: { noAction: true },
      },
      aiAgentSettings: {
        enabled: true,
        startAfterHours: 2,
        retryIntervalHours: 3,
        callWindowFrom: "09:00",
        callWindowTo: "20:00",
        maxRetries: 5,
        voiceType: "Male 1" as const,
        personaScript: "Hello, this is a follow-up call from our team regarding your recent inquiry.",
        triggerHumanFollowUpOnFailure: true,
        triggerHumanFollowUpOnDissatisfaction: false,
        triggerHumanFollowUpOnVerbalComplaint: true,
      },
      insights: {
        npsScore: 71,
        responseCount: 89,
        responseRate: 56.2,
        promotersPercent: 60,
        passivesPercent: 24,
        detractorsPercent: 16,
        responseSources: { email: 0, sms: 0, aiCall: 89 },
        npsOverTime: [
          { date: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000), score: 68 },
          { date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), score: 70 },
          { date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), score: 72 },
          { date: now, score: 71 },
        ],
        aiAgentMetrics: {
          totalCalls: 158,
          successfulCalls: 97,
          unreachable: 42,
          avgCallDuration: 145,
          escalationReasons: [
            { reason: "Customer interested in demo", count: 28 },
            { reason: "Call back requested", count: 15 },
            { reason: "Escalation to sales team", count: 9 },
          ],
        },
        reviewPerformance: {
          totalReviewRequestsSent: 0,
          clickRate: 0,
          clicksByChannel: [],
          clicksByPlatform: [],
          engagementRate: 0,
          engagementTrend: [],
        },
        detractorTickets: [],
      },
      createdAt: thirtyDaysAgo,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      name: "Q4 Customer Satisfaction Survey",
      description: "Annual customer satisfaction survey for all new vehicle purchases in Q4",
      language: "EN",
      serviceType: "New Vehicle Purchase",
      status: "Active",
      startDate: thirtyDaysAgo,
      endDate: tomorrow,
      targetAudience: "New vehicle buyers in the last 30 days",
      triggerType: "Delayed",
      delayHours: 48,
      dataSource: "CRM Database",
      questionSourceType: "manual" as const,
      externalQuestionSourceUrl: "",
      surveyQuestions: DEFAULT_QUESTIONS["New Vehicle Purchase"],
      followUpSteps: baseFollowUpSteps,
      messageTemplates: baseMessageTemplates,
      reviewChannels: baseReviewChannels,
      outcomeRules: baseOutcomeRules,
      aiAgentSettings: baseAISettings,
      insights: {
        npsScore: 72,
        responseCount: 245,
        responseRate: 34.5,
        promotersPercent: 58,
        passivesPercent: 22,
        detractorsPercent: 20,
        responseSources: { email: 145, sms: 62, aiCall: 38 },
        npsOverTime: [
          { date: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000), score: 68 },
          { date: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000), score: 70 },
          { date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), score: 69 },
          { date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), score: 74 },
          { date: now, score: 72 },
        ],
        aiAgentMetrics: {
          totalCalls: 156,
          successfulCalls: 124,
          unreachable: 32,
          avgCallDuration: 180,
          escalationReasons: [
            { reason: "Customer dissatisfaction", count: 12 },
            { reason: "Technical issue", count: 5 },
            { reason: "Verbal complaint", count: 8 },
          ],
        },
        reviewPerformance: {
          totalReviewRequestsSent: 142,
          clickRate: 28.5,
          clicksByChannel: [
            { channel: "Email", clicks: 52 },
            { channel: "SMS", clicks: 31 },
            { channel: "WhatsApp", clicks: 18 },
          ],
          clicksByPlatform: [
            { platform: "Google", clicks: 64 },
            { platform: "Facebook", clicks: 25 },
            { platform: "AutoScout24", clicks: 12 },
          ],
          engagementRate: 42.3,
          engagementTrend: [
            { date: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000), rate: 38 },
            { date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), rate: 41 },
            { date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), rate: 44 },
            { date: now, rate: 42 },
          ],
        },
        detractorTickets: [
          { id: "dt1", customerName: "Michael Schmidt", issue: "Long wait times at service desk", status: "In Progress", actionTaken: "Manager follow-up scheduled", createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
          { id: "dt2", customerName: "Emma Weber", issue: "Vehicle delivery delayed", status: "Resolved", actionTaken: "Compensation offered and accepted", createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
          { id: "dt3", customerName: "Thomas Müller", issue: "Unsatisfied with financing terms", status: "Open", actionTaken: "Pending review", createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
        ],
      },
      createdAt: sixtyDaysAgo,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      name: "Service Excellence Feedback - DE",
      description: "Ongoing service visit feedback collection for German-speaking customers",
      language: "DE",
      serviceType: "Service Visit",
      status: "Completed",
      startDate: sixtyDaysAgo,
      endDate: yesterday,
      targetAudience: "Service center visitors - German speakers",
      triggerType: "Immediate",
      delayHours: 0,
      dataSource: "Service Appointments System",
      questionSourceType: "manual" as const,
      externalQuestionSourceUrl: "",
      surveyQuestions: DEFAULT_QUESTIONS["Service Visit"],
      followUpSteps: [
        { id: "fs1", order: 1, actionType: "Send Email" as const, delayDays: 0, configuration: {} },
        { id: "fs2", order: 2, actionType: "Send SMS" as const, delayDays: 1, configuration: {} },
      ],
      messageTemplates: {
        email: {
          subject: "Ihre Meinung ist uns wichtig!",
          body: "Sehr geehrte/r {{customerName}}, vielen Dank für Ihren Besuch.",
        },
        sms: {
          body: "Hallo {{customerName}}! Bewerten Sie Ihren Besuch: {{surveyLink}}",
        },
        whatsapp: {
          template: "Hallo {{customerName}}, Ihr Feedback ist uns wichtig: {{surveyLink}}",
        },
      },
      reviewChannels: baseReviewChannels,
      outcomeRules: baseOutcomeRules,
      aiAgentSettings: { ...baseAISettings, enabled: false },
      insights: {
        npsScore: 68,
        responseCount: 412,
        responseRate: 41.2,
        promotersPercent: 52,
        passivesPercent: 28,
        detractorsPercent: 20,
        responseSources: { email: 298, sms: 114, aiCall: 0 },
        npsOverTime: [
          { date: new Date(now.getTime() - 56 * 24 * 60 * 60 * 1000), score: 65 },
          { date: new Date(now.getTime() - 42 * 24 * 60 * 60 * 1000), score: 66 },
          { date: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000), score: 69 },
          { date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), score: 68 },
          { date: yesterday, score: 68 },
        ],
        aiAgentMetrics: {
          totalCalls: 0,
          successfulCalls: 0,
          unreachable: 0,
          avgCallDuration: 0,
          escalationReasons: [],
        },
        reviewPerformance: {
          totalReviewRequestsSent: 214,
          clickRate: 31.2,
          clicksByChannel: [
            { channel: "Email", clicks: 89 },
            { channel: "SMS", clicks: 42 },
          ],
          clicksByPlatform: [
            { platform: "Google", clicks: 98 },
            { platform: "Facebook", clicks: 33 },
          ],
          engagementRate: 38.5,
          engagementTrend: [
            { date: new Date(now.getTime() - 42 * 24 * 60 * 60 * 1000), rate: 35 },
            { date: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000), rate: 37 },
            { date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), rate: 40 },
            { date: yesterday, rate: 38 },
          ],
        },
        detractorTickets: [
          { id: "dt4", customerName: "Hans Fischer", issue: "Repair not completed correctly", status: "Resolved", actionTaken: "Free re-service provided", createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) },
        ],
      },
      createdAt: sixtyDaysAgo,
      updatedAt: yesterday,
    },
    {
      id: uuidv4(),
      name: "Leasing Experience Survey - AR",
      description: "New leasing customer feedback campaign for Arabic-speaking market",
      language: "AR",
      serviceType: "Leasing",
      status: "Draft",
      startDate: thirtyDaysFuture,
      endDate: sixtyDaysFuture,
      targetAudience: "New leasing customers - Arabic speakers",
      triggerType: "Delayed",
      delayHours: 72,
      dataSource: "Leasing Management System",
      questionSourceType: "manual" as const,
      externalQuestionSourceUrl: "",
      surveyQuestions: DEFAULT_QUESTIONS["Leasing"],
      followUpSteps: baseFollowUpSteps,
      messageTemplates: {
        email: {
          subject: "نحن نقدر رأيك!",
          body: "عزيزي {{customerName}}، شكراً لاختيارك لنا.",
        },
        sms: {
          body: "مرحباً {{customerName}}! قيم تجربتك: {{surveyLink}}",
        },
        whatsapp: {
          template: "مرحباً {{customerName}}، رأيك مهم لنا: {{surveyLink}}",
        },
      },
      reviewChannels: baseReviewChannels,
      outcomeRules: baseOutcomeRules,
      aiAgentSettings: { ...baseAISettings, voiceType: "Male 1" },
      insights: { ...emptyInsights },
      createdAt: now,
      updatedAt: now,
    },
  ];
};
