export type Language = "EN" | "DE" | "AR";
export type ServiceType = "New Vehicle Purchase" | "Service Visit" | "Parts Purchase" | "Financing" | "Leasing";
export type CampaignStatus = "Active" | "Paused" | "Draft" | "Completed";
export type TriggerType = "Immediate" | "Delayed";
export type QuestionType = "Yes/No" | "Grade" | "Text" | "Rating";
export type ActionType = "Send Email" | "Send SMS" | "Send AI Call" | "Create dispute on Fidspark" | "Create NPS Task on Leadspark" | "Create follow-up task via Webhook";
export type VoiceType = "Male 1" | "Male 2" | "Female 1" | "Female 2" | "Neutral";
export type TicketStatus = "Open" | "In Progress" | "Resolved";
export type QuestionSourceType = "external" | "manual";

export interface SurveyQuestion {
  id: string;
  type: QuestionType;
  text: string;
  required: boolean;
  order: number;
}

export interface FollowUpStep {
  id: string;
  order: number;
  actionType: ActionType;
  delayDays: number;
  configuration: Record<string, unknown>;
}

export interface MessageTemplate {
  email: {
    subject: string;
    body: string;
  };
  sms: {
    body: string;
  };
  whatsapp: {
    template: string;
  };
}

export interface OutcomeRules {
  detractors: {
    createFidsparkDispute: boolean;
    createLeadsparkTask: boolean;
    createWebhookTask: boolean;
    webhookUrl: string;
    webhookSecret: string;
    webhookPayloadTemplate: string;
  };
  nonResponders: {
    createFidsparkDispute: boolean;
    createLeadsparkTask: boolean;
    createWebhookTask: boolean;
  };
  promoters: {
    notifyFidspark: boolean;
  };
  passives: {
    noAction: boolean;
  };
}

export interface AIAgentSettings {
  enabled: boolean;
  startAfterHours: number;
  retryIntervalHours: number;
  callWindowFrom: string;
  callWindowTo: string;
  maxRetries: number;
  voiceType: VoiceType;
  personaScript: string;
  triggerHumanFollowUpOnFailure: boolean;
  triggerHumanFollowUpOnDissatisfaction: boolean;
  triggerHumanFollowUpOnVerbalComplaint: boolean;
}

export interface DetractorTicket {
  id: string;
  customerName: string;
  issue: string;
  status: TicketStatus;
  actionTaken: string;
  createdAt: Date;
}

export interface DetractorTask {
  id: string;
  customerName: string;
  taskDescription: string;
  status: TicketStatus;
  assignedTo: string;
  priority: "High" | "Medium" | "Low";
  createdAt: Date;
}

export interface CampaignInsights {
  npsScore: number;
  responseCount: number;
  responseRate: number;
  promotersPercent: number;
  passivesPercent: number;
  detractorsPercent: number;
  responseSources: {
    email: number;
    sms: number;
    aiCall: number;
  };
  npsOverTime: Array<{ date: Date; score: number }>;
  aiAgentMetrics: {
    totalCalls: number;
    successfulCalls: number;
    unreachable: number;
    avgCallDuration: number;
    escalationReasons: Array<{ reason: string; count: number }>;
  };
  detractorTickets: DetractorTicket[];
  detractorTasks: DetractorTask[];
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  language: Language;
  serviceType: ServiceType;
  status: CampaignStatus;
  startDate: Date;
  endDate: Date;
  targetAudience: string;
  triggerType: TriggerType;
  delayHours: number;
  dataSource: string;
  surveyQuestions: SurveyQuestion[];
  followUpSteps: FollowUpStep[];
  messageTemplates: MessageTemplate;
  outcomeRules: OutcomeRules;
  aiAgentSettings: AIAgentSettings;
  insights: CampaignInsights;
  questionSourceType: QuestionSourceType;
  externalQuestionSourceUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_QUESTIONS: Record<ServiceType, SurveyQuestion[]> = {
  "New Vehicle Purchase": [
    { id: "q1", type: "Rating", text: "How satisfied are you with your new vehicle purchase experience?", required: true, order: 1 },
    { id: "q2", type: "Yes/No", text: "Would you recommend our dealership to friends and family?", required: true, order: 2 },
    { id: "q3", type: "Text", text: "What could we have done better during your purchase process?", required: false, order: 3 },
  ],
  "Service Visit": [
    { id: "q1", type: "Rating", text: "How would you rate your recent service visit?", required: true, order: 1 },
    { id: "q2", type: "Yes/No", text: "Was your vehicle ready on time?", required: true, order: 2 },
    { id: "q3", type: "Text", text: "Please share any feedback about our service team.", required: false, order: 3 },
  ],
  "Parts Purchase": [
    { id: "q1", type: "Rating", text: "How satisfied are you with your parts purchase?", required: true, order: 1 },
    { id: "q2", type: "Yes/No", text: "Did you find the parts you were looking for?", required: true, order: 2 },
    { id: "q3", type: "Text", text: "How can we improve our parts department?", required: false, order: 3 },
  ],
  "Financing": [
    { id: "q1", type: "Rating", text: "How would you rate your financing experience?", required: true, order: 1 },
    { id: "q2", type: "Yes/No", text: "Were the financing terms clearly explained?", required: true, order: 2 },
    { id: "q3", type: "Text", text: "Any suggestions to improve our financing process?", required: false, order: 3 },
  ],
  "Leasing": [
    { id: "q1", type: "Rating", text: "How satisfied are you with your leasing experience?", required: true, order: 1 },
    { id: "q2", type: "Yes/No", text: "Would you consider leasing from us again?", required: true, order: 2 },
    { id: "q3", type: "Text", text: "What would make your leasing experience even better?", required: false, order: 3 },
  ],
};
