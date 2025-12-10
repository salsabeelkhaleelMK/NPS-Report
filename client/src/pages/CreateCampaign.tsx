import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, Rocket, Trash2, Plus, Database, Upload, Link2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { createCampaign } from "@/lib/campaignStore";
import { useToast } from "@/hooks/use-toast";
import StepIndicator from "@/components/campaigns/StepIndicator";
import DraggableList from "@/components/campaigns/DraggableList";
import {
  Language,
  ServiceType,
  TriggerType,
  Campaign,
  SurveyQuestion,
  FollowUpStep,
  ActionType,
  VoiceType,
  DEFAULT_QUESTIONS,
} from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const WIZARD_STEPS = [
  { id: 1, title: "Setup" },
  { id: 2, title: "Timeline" },
  { id: 3, title: "Leads source" },
  { id: 4, title: "Survey" },
  { id: 5, title: "Outcomes" },
];

const ACTION_TYPES: ActionType[] = [
  "Send Email",
  "Send SMS",
  "Send AI Call",
  "Create dispute on Fidspark",
  "Create NPS Task on Leadspark",
  "Create follow-up task via Webhook",
];

type DataSourceType = "external_crm" | "leadspark" | "manual_upload";
type QuestionSourceType = "external" | "manual";

const initialFormData: Omit<Campaign, "id" | "createdAt" | "updatedAt"> & {
  dataSourceType: DataSourceType;
  externalCrmUrl: string;
  questionSourceType: QuestionSourceType;
  externalQuestionSourceUrl: string;
  endDateEnabled: boolean;
} = {
  name: "",
  description: "",
  language: "EN",
  serviceType: "New Vehicle Purchase",
  status: "Draft",
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  endDateEnabled: false,
  targetAudience: "",
  triggerType: "Immediate",
  delayHours: 0,
  dataSource: "",
  dataSourceType: "leadspark",
  externalCrmUrl: "",
  questionSourceType: "external",
  externalQuestionSourceUrl: "",
  surveyQuestions: DEFAULT_QUESTIONS["New Vehicle Purchase"].map((q) => ({ ...q, id: uuidv4() })),
  followUpSteps: [
    { id: uuidv4(), order: 1, actionType: "Send AI Call", delayDays: 0, configuration: {} },
  ],
  messageTemplates: {
    email: { subject: "", body: "" },
    sms: { body: "" },
    whatsapp: { template: "" },
  },
  reviewChannels: [
    { id: uuidv4(), platform: "Google", priority: 1, enabled: false },
    { id: uuidv4(), platform: "Facebook", priority: 2, enabled: false },
    { id: uuidv4(), platform: "AutoScout24", priority: 3, enabled: false },
    { id: uuidv4(), platform: "mobile.de", priority: 4, enabled: false },
  ],
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
    enabled: false,
    startAfterHours: 24,
    retryIntervalHours: 4,
    callWindowFrom: "09:00",
    callWindowTo: "18:00",
    maxRetries: 3,
    voiceType: "Female 1",
    personaScript: "",
    triggerHumanFollowUpOnFailure: false,
    triggerHumanFollowUpOnDissatisfaction: false,
    triggerHumanFollowUpOnVerbalComplaint: false,
  },
  insights: {
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
  },
};

export default function CreateCampaign() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [showServiceChangeDialog, setShowServiceChangeDialog] = useState(false);
  const [pendingServiceType, setPendingServiceType] = useState<ServiceType | null>(null);
  const [expandedStepSettings, setExpandedStepSettings] = useState<Set<string>>(new Set());

  const updateField = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceTypeChange = (newType: ServiceType) => {
    if (newType !== formData.serviceType && formData.surveyQuestions.length > 0) {
      setPendingServiceType(newType);
      setShowServiceChangeDialog(true);
    } else {
      updateField("serviceType", newType);
      updateField(
        "surveyQuestions",
        DEFAULT_QUESTIONS[newType].map((q) => ({ ...q, id: uuidv4() }))
      );
    }
  };

  const confirmServiceTypeChange = () => {
    if (pendingServiceType) {
      updateField("serviceType", pendingServiceType);
      updateField(
        "surveyQuestions",
        DEFAULT_QUESTIONS[pendingServiceType].map((q) => ({ ...q, id: uuidv4() }))
      );
    }
    setShowServiceChangeDialog(false);
    setPendingServiceType(null);
  };

  const addQuestion = () => {
    const newQuestion: SurveyQuestion = {
      id: uuidv4(),
      type: "Rating",
      text: "",
      required: true,
      order: formData.surveyQuestions.length + 1,
    };
    updateField("surveyQuestions", [...formData.surveyQuestions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    updateField(
      "surveyQuestions",
      formData.surveyQuestions.filter((q) => q.id !== id)
    );
  };

  const addFollowUpStep = () => {
    const newStep: FollowUpStep = {
      id: uuidv4(),
      order: formData.followUpSteps.length + 1,
      actionType: "Send Email",
      delayDays: 0,
      configuration: {},
    };
    updateField("followUpSteps", [...formData.followUpSteps, newStep]);
  };

  const removeFollowUpStep = (id: string) => {
    updateField(
      "followUpSteps",
      formData.followUpSteps.filter((s) => s.id !== id)
    );
  };

  const toggleStepSettings = (stepId: string) => {
    setExpandedStepSettings((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  const updateStepConfiguration = (stepId: string, config: Record<string, unknown>) => {
    const updated = formData.followUpSteps.map((s) =>
      s.id === stepId ? { ...s, configuration: { ...s.configuration, ...config } } : s
    );
    updateField("followUpSteps", updated);
  };

  const getStepConfiguration = (stepId: string, key: string, defaultValue: unknown = "") => {
    const step = formData.followUpSteps.find((s) => s.id === stepId);
    return step?.configuration?.[key] ?? defaultValue;
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.name.trim() !== "" && formData.description.trim() !== "";
      case 2:
        return formData.followUpSteps.length > 0;
      case 3:
        if (formData.dataSourceType === "external_crm") {
          return formData.externalCrmUrl.trim() !== "";
        }
        if (formData.dataSourceType === "manual_upload") {
          return formData.targetAudience.trim() !== "";
        }
        return true;
      case 4:
        if (formData.questionSourceType === "external") {
          return formData.externalQuestionSourceUrl.trim() !== "";
        }
        return formData.surveyQuestions.length > 0;
      case 5:
        return true;
      case 6:
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
      return;
    }
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLaunch = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Validation Error",
        description: "Please ensure all required fields are filled.",
        variant: "destructive",
      });
      return;
    }

    const campaignData = {
      ...formData,
      endDate: formData.endDateEnabled ? formData.endDate : undefined,
    };
    
    const campaign = createCampaign(campaignData as Omit<Campaign, "id" | "createdAt" | "updatedAt">);
    toast({
      title: "Campaign Created",
      description: `"${campaign.name}" has been created successfully.`,
    });
    setLocation(`/campaigns/${campaign.id}`);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-900">Campaign Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter campaign name"
                className="mt-2 bg-white border-gray-200 rounded-md"
                data-testid="input-campaign-name"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-900">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe the purpose of this campaign"
                className="mt-2 bg-white border-gray-200 rounded-md"
                rows={3}
                data-testid="input-campaign-description"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-900">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(v) => updateField("language", v as Language)}
                >
                  <SelectTrigger className="mt-2 bg-white border-gray-200 rounded-md" data-testid="select-language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EN">English</SelectItem>
                    <SelectItem value="DE">German</SelectItem>
                    <SelectItem value="AR">Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-900">Service Type</Label>
                <Select value={formData.serviceType} onValueChange={handleServiceTypeChange}>
                  <SelectTrigger className="mt-2 bg-white border-gray-200 rounded-md" data-testid="select-service-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New Vehicle Purchase">New Vehicle Purchase</SelectItem>
                    <SelectItem value="Service Visit">Service Visit</SelectItem>
                    <SelectItem value="Parts Purchase">Parts Purchase</SelectItem>
                    <SelectItem value="Financing">Financing</SelectItem>
                    <SelectItem value="Leasing">Leasing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-900">Start Date *</Label>
                <Input
                  type="date"
                  value={formData.startDate.toISOString().split("T")[0]}
                  onChange={(e) => updateField("startDate", new Date(e.target.value))}
                  className="mt-2 bg-white border-gray-200 rounded-md"
                  data-testid="input-start-date"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-gray-900">End Date (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-gray-500">Enable</Label>
                    <Switch
                      checked={formData.endDateEnabled}
                      onCheckedChange={(v) => updateField("endDateEnabled", v)}
                      data-testid="switch-end-date-enabled"
                    />
                  </div>
                </div>
                <Input
                  type="date"
                  value={formData.endDate.toISOString().split("T")[0]}
                  onChange={(e) => updateField("endDate", new Date(e.target.value))}
                  className="bg-white border-gray-200 rounded-md"
                  disabled={!formData.endDateEnabled}
                  data-testid="input-end-date"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label className="text-base font-semibold text-gray-900">Timeline Flow</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Define the sequence of actions for campaign timeline
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={addFollowUpStep} className="border-gray-200" data-testid="button-add-step">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>
              <DraggableList
                items={formData.followUpSteps}
                onReorder={(items) =>
                  updateField(
                    "followUpSteps",
                    items.map((item, index) => ({ ...item, order: index + 1 }))
                  )
                }
                renderItem={(step, index) => {
                  const isExpanded = expandedStepSettings.has(step.id);
                  const renderStepSettings = () => {
                    if (!isExpanded) return null;

                    switch (step.actionType) {
                      case "Send Email":
                        return (
                          <div className="pt-4 border-t border-gray-100">
                            <Label className="text-sm font-semibold text-gray-900 mb-2 block">Email Template</Label>
                            <p className="text-xs text-gray-500 mb-4">
                  Configure the email template for "Send Email" steps
                </p>
                <div className="space-y-4">
                  <div>
                                <Label className="text-sm font-medium text-gray-900">Subject</Label>
                    <Input
                                  value={(getStepConfiguration(step.id, "emailSubject") as string) || formData.messageTemplates.email.subject}
                                  onChange={(e) => updateStepConfiguration(step.id, { emailSubject: e.target.value })}
                      placeholder="We'd love your feedback!"
                                  className="mt-2 bg-white border-gray-200"
                      data-testid="input-email-subject"
                    />
                  </div>
                  <div>
                                <Label className="text-sm font-medium text-gray-900">Body</Label>
                    <Textarea
                                  value={(getStepConfiguration(step.id, "emailBody") as string) || formData.messageTemplates.email.body}
                                  onChange={(e) => updateStepConfiguration(step.id, { emailBody: e.target.value })}
                      placeholder="Use {{customerName}} and {{surveyLink}} as placeholders"
                                  className="mt-2 bg-white border-gray-200"
                      rows={4}
                      data-testid="input-email-body"
                    />
                  </div>
                </div>
              </div>
                        );
                      case "Send SMS":
                        return (
                          <div className="pt-4 border-t border-gray-100">
                            <Label className="text-sm font-semibold text-gray-900 mb-2 block">SMS Template</Label>
                            <p className="text-xs text-gray-500 mb-4">
                  Configure the SMS template for "Send SMS" steps
                </p>
                <div>
                              <Label className="text-sm font-medium text-gray-900">Message</Label>
                  <Textarea
                                value={(getStepConfiguration(step.id, "smsBody") as string) || formData.messageTemplates.sms.body}
                                onChange={(e) => updateStepConfiguration(step.id, { smsBody: e.target.value })}
                    placeholder="Hi {{customerName}}! Rate your experience: {{surveyLink}}"
                                className="mt-2 bg-white border-gray-200"
                    rows={3}
                    data-testid="input-sms-body"
                  />
                </div>
              </div>
                        );
                      case "Send AI Call":
                        return (
                          <div className="pt-4 border-t border-gray-100">
                            <Label className="text-sm font-semibold text-gray-900 mb-2 block">AI Agent Settings</Label>
                            <p className="text-xs text-gray-500 mb-4">
                  Configure the AI agent for "Send AI Call" steps
                </p>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                                  <Label className="text-sm font-medium text-gray-900">Start After (hours)</Label>
                      <Input
                        type="number"
                                    value={(getStepConfiguration(step.id, "startAfterHours") as number) ?? formData.aiAgentSettings.startAfterHours}
                                    onChange={(e) => updateStepConfiguration(step.id, { startAfterHours: parseInt(e.target.value) || 0 })}
                                    className="mt-2 bg-white border-gray-200"
                        data-testid="input-start-after"
                      />
                                  <p className="text-xs text-gray-500 mt-1">
                        Hours to wait before making the first call
                      </p>
                    </div>
                    <div>
                                  <Label className="text-sm font-medium text-gray-900">Retry Interval (hours)</Label>
                      <Input
                        type="number"
                                    value={(getStepConfiguration(step.id, "retryIntervalHours") as number) ?? formData.aiAgentSettings.retryIntervalHours}
                                    onChange={(e) => updateStepConfiguration(step.id, { retryIntervalHours: parseInt(e.target.value) || 0 })}
                                    className="mt-2 bg-white border-gray-200"
                        data-testid="input-retry-interval"
                      />
                                  <p className="text-xs text-gray-500 mt-1">
                        Hours between retry attempts
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                                  <Label className="text-sm font-medium text-gray-900">Max Retries</Label>
                      <Input
                        type="number"
                                    value={(getStepConfiguration(step.id, "maxRetries") as number) ?? formData.aiAgentSettings.maxRetries}
                                    onChange={(e) => updateStepConfiguration(step.id, { maxRetries: parseInt(e.target.value) || 0 })}
                                    className="mt-2 bg-white border-gray-200"
                        data-testid="input-max-retries"
                      />
                    </div>
                    <div>
                                  <Label className="text-sm font-medium text-gray-900">Voice Type</Label>
                      <Select
                                    value={(getStepConfiguration(step.id, "voiceType") as string) || formData.aiAgentSettings.voiceType}
                                    onValueChange={(v) => updateStepConfiguration(step.id, { voiceType: v })}
                      >
                                    <SelectTrigger className="mt-2 bg-white border-gray-200" data-testid="select-voice-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male 1">Male 1</SelectItem>
                          <SelectItem value="Male 2">Male 2</SelectItem>
                          <SelectItem value="Female 1">Female 1</SelectItem>
                          <SelectItem value="Female 2">Female 2</SelectItem>
                          <SelectItem value="Neutral">Neutral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                                  <Label className="text-sm font-medium text-gray-900">Call Window From</Label>
                      <Input
                        type="time"
                                    value={(getStepConfiguration(step.id, "callWindowFrom") as string) || formData.aiAgentSettings.callWindowFrom}
                                    onChange={(e) => updateStepConfiguration(step.id, { callWindowFrom: e.target.value })}
                                    className="mt-2 bg-white border-gray-200"
                        data-testid="input-call-from"
                      />
                    </div>
                    <div>
                                  <Label className="text-sm font-medium text-gray-900">Call Window To</Label>
                      <Input
                        type="time"
                                    value={(getStepConfiguration(step.id, "callWindowTo") as string) || formData.aiAgentSettings.callWindowTo}
                                    onChange={(e) => updateStepConfiguration(step.id, { callWindowTo: e.target.value })}
                                    className="mt-2 bg-white border-gray-200"
                        data-testid="input-call-to"
                      />
                    </div>
                  </div>

                  <div>
                                <Label className="text-sm font-medium text-gray-900">Persona Script</Label>
                    <Textarea
                                  value={(getStepConfiguration(step.id, "personaScript") as string) || formData.aiAgentSettings.personaScript}
                                  onChange={(e) => updateStepConfiguration(step.id, { personaScript: e.target.value })}
                                  className="mt-2 bg-white border-gray-200"
                      rows={4}
                      placeholder="Hello, this is Sarah from AutoHaus. I'm calling to follow up on your recent experience with us..."
                      data-testid="input-persona-script"
                    />
                                <p className="text-xs text-gray-500 mt-1">
                      The script the AI agent will use when making calls
                    </p>
                  </div>

                              <div className="pt-4 border-t border-gray-100">
                                <Label className="text-sm font-semibold text-gray-900 mb-3 block">Human Escalation Triggers</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                                      <Label className="text-sm text-gray-900">On Call Failure</Label>
                                      <p className="text-xs text-gray-500">Escalate when AI agent cannot complete the call</p>
                        </div>
                        <Switch
                                      checked={(getStepConfiguration(step.id, "triggerHumanFollowUpOnFailure") as boolean) ?? formData.aiAgentSettings.triggerHumanFollowUpOnFailure}
                                      onCheckedChange={(v) => updateStepConfiguration(step.id, { triggerHumanFollowUpOnFailure: v })}
                          data-testid="switch-escalate-failure"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                                      <Label className="text-sm text-gray-900">On Dissatisfaction Detected</Label>
                                      <p className="text-xs text-gray-500">Escalate when customer expresses dissatisfaction</p>
                        </div>
                        <Switch
                                      checked={(getStepConfiguration(step.id, "triggerHumanFollowUpOnDissatisfaction") as boolean) ?? formData.aiAgentSettings.triggerHumanFollowUpOnDissatisfaction}
                                      onCheckedChange={(v) => updateStepConfiguration(step.id, { triggerHumanFollowUpOnDissatisfaction: v })}
                          data-testid="switch-escalate-dissatisfaction"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                                      <Label className="text-sm text-gray-900">On Verbal Complaint</Label>
                                      <p className="text-xs text-gray-500">Escalate when customer makes a verbal complaint</p>
                        </div>
                        <Switch
                                      checked={(getStepConfiguration(step.id, "triggerHumanFollowUpOnVerbalComplaint") as boolean) ?? formData.aiAgentSettings.triggerHumanFollowUpOnVerbalComplaint}
                                      onCheckedChange={(v) => updateStepConfiguration(step.id, { triggerHumanFollowUpOnVerbalComplaint: v })}
                          data-testid="switch-escalate-complaint"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                        );
                      default:
                        return null;
                    }
                  };

                  return (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      {/* Header Row */}
                      <div className="flex items-center gap-3 p-4">
                        <span className="text-sm text-gray-400 font-medium">#{index + 1}</span>
                        <Select
                          value={step.actionType}
                          onValueChange={(v) => {
                            const updated = formData.followUpSteps.map((s) =>
                              s.id === step.id ? { ...s, actionType: v as ActionType } : s
                            );
                            updateField("followUpSteps", updated);
                          }}
                        >
                          <SelectTrigger className="flex-1 bg-white border-gray-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ACTION_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-gray-500 whitespace-nowrap">Delay</Label>
                          <Input
                            type="number"
                            value={step.delayDays}
                            onChange={(e) => {
                              const updated = formData.followUpSteps.map((s) =>
                                s.id === step.id ? { ...s, delayDays: parseInt(e.target.value) || 0 } : s
                              );
                              updateField("followUpSteps", updated);
                            }}
                            className="w-16 bg-white border-gray-200"
                            min={0}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFollowUpStep(step.id)}
                          className="text-gray-400 hover:text-red-600"
                          disabled={formData.followUpSteps.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Collapsible Settings Section */}
                      <div className="border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => toggleStepSettings(step.id)}
                          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          <span>Settings</span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4">
                            {renderStepSettings()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold text-gray-900">Connect Leads Source</Label>
              <p className="text-sm text-gray-500 mb-4">
                Select how you want to import leads for this campaign
              </p>
              
              <RadioGroup
                value={formData.dataSourceType}
                onValueChange={(v) => updateField("dataSourceType", v as DataSourceType)}
                className="space-y-3"
              >
                <Card 
                  className={`p-4 bg-white border rounded-lg cursor-pointer transition-all ${formData.dataSourceType === "external_crm" ? "border-primary ring-1 ring-primary" : "border-gray-200 hover:border-gray-300"}`}
                  onClick={() => updateField("dataSourceType", "external_crm")}
                >
                  <div className="flex items-start gap-4">
                    <RadioGroupItem value="external_crm" id="external_crm" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-5 w-5 text-primary" />
                        <Label htmlFor="external_crm" className="font-medium text-gray-900 cursor-pointer">External CRM</Label>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Connect to an external CRM system via API
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card 
                  className={`p-4 bg-white border rounded-lg cursor-pointer transition-all ${formData.dataSourceType === "leadspark" ? "border-primary ring-1 ring-primary" : "border-gray-200 hover:border-gray-300"}`}
                  onClick={() => updateField("dataSourceType", "leadspark")}
                >
                  <div className="flex items-start gap-4">
                    <RadioGroupItem value="leadspark" id="leadspark" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-primary" />
                        <Label htmlFor="leadspark" className="font-medium text-gray-900 cursor-pointer">Leadspark Internal</Label>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Use leads from your Leadspark internal system
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card 
                  className={`p-4 bg-white border rounded-lg cursor-pointer transition-all ${formData.dataSourceType === "manual_upload" ? "border-primary ring-1 ring-primary" : "border-gray-200 hover:border-gray-300"}`}
                  onClick={() => updateField("dataSourceType", "manual_upload")}
                >
                  <div className="flex items-start gap-4">
                    <RadioGroupItem value="manual_upload" id="manual_upload" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Upload className="h-5 w-5 text-primary" />
                        <Label htmlFor="manual_upload" className="font-medium text-gray-900 cursor-pointer">Manual Upload</Label>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Upload a CSV file or enter leads manually
                      </p>
                    </div>
                  </div>
                </Card>
              </RadioGroup>
            </div>

            {formData.dataSourceType === "external_crm" && (
              <div className="pt-4 border-t border-gray-100">
                <Label htmlFor="crm-url" className="text-sm font-medium text-gray-900">External CRM API URL *</Label>
                <Input
                  id="crm-url"
                  value={formData.externalCrmUrl}
                  onChange={(e) => updateField("externalCrmUrl", e.target.value)}
                  placeholder="https://api.yourcrm.com/leads"
                  className="mt-2 bg-white border-gray-200"
                  data-testid="input-external-crm-url"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter the API endpoint URL to fetch leads from your CRM
                </p>
              </div>
            )}

            {formData.dataSourceType === "leadspark" && (
              <div className="pt-4 border-t border-gray-100">
                <Label className="text-sm font-medium text-gray-900">Leadspark Connection</Label>
                <Card className="p-4 mt-2 bg-green-50 border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <Database className="h-5 w-5" />
                    <span className="font-medium">Connected to Leadspark</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Leads will be automatically synced from your Leadspark account
                  </p>
                </Card>
              </div>
            )}

            {formData.dataSourceType === "manual_upload" && (
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <div>
                  <Label htmlFor="target" className="text-sm font-medium text-gray-900">Target Audience Description *</Label>
                  <Textarea
                    id="target"
                    value={formData.targetAudience}
                    onChange={(e) => updateField("targetAudience", e.target.value)}
                    placeholder="Describe who will receive this survey"
                    className="mt-2 bg-white border-gray-200"
                    rows={2}
                    data-testid="input-target-audience"
                  />
                </div>
                <Card className="p-6 border-dashed border-2 border-gray-200 bg-gray-50 rounded-lg">
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-900">Drop your CSV file here</p>
                    <p className="text-xs text-gray-500 mt-1">or click to browse</p>
                    <Button variant="outline" size="sm" className="mt-3 border-gray-200">
                      Select File
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100">
              <Label className="text-sm font-medium text-gray-900">Trigger Type</Label>
              <Select
                value={formData.triggerType}
                onValueChange={(v) => updateField("triggerType", v as TriggerType)}
              >
                <SelectTrigger className="mt-2 bg-white border-gray-200" data-testid="select-trigger-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Immediate">Immediate</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
              {formData.triggerType === "Delayed" && (
                <div className="mt-4">
                  <Label htmlFor="delay" className="text-sm font-medium text-gray-900">Delay Hours</Label>
                  <Input
                    id="delay"
                    type="number"
                    value={formData.delayHours}
                    onChange={(e) => updateField("delayHours", parseInt(e.target.value) || 0)}
                    className="mt-2 bg-white border-gray-200"
                    data-testid="input-delay-hours"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold text-gray-900">Question Source</Label>
              <p className="text-sm text-gray-500 mb-4">
                Choose how to configure survey questions
              </p>
              
              <RadioGroup
                value={formData.questionSourceType}
                onValueChange={(v) => updateField("questionSourceType", v as QuestionSourceType)}
                className="flex gap-4"
              >
                <Card 
                  className={`flex-1 p-4 bg-white border rounded-lg cursor-pointer transition-all ${formData.questionSourceType === "external" ? "border-primary ring-1 ring-primary" : "border-gray-200 hover:border-gray-300"}`}
                  onClick={() => updateField("questionSourceType", "external")}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="external" id="external" />
                    <div>
                      <Label htmlFor="external" className="font-medium text-gray-900 cursor-pointer">External Source</Label>
                      <p className="text-xs text-gray-500">Connect to external API</p>
                    </div>
                  </div>
                </Card>
                
                <Card 
                  className={`flex-1 p-4 bg-white border rounded-lg cursor-pointer transition-all ${formData.questionSourceType === "manual" ? "border-primary ring-1 ring-primary" : "border-gray-200 hover:border-gray-300"}`}
                  onClick={() => updateField("questionSourceType", "manual")}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="manual" id="manual" />
                    <div>
                      <Label htmlFor="manual" className="font-medium text-gray-900 cursor-pointer">Manual Configuration</Label>
                      <p className="text-xs text-gray-500">Add and customize questions</p>
                    </div>
                  </div>
                </Card>
              </RadioGroup>
            </div>

            {formData.questionSourceType === "external" && (
              <div className="pt-4">
                <Label htmlFor="question-source-url" className="text-sm font-medium text-gray-900">External Question Source URL *</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="question-source-url"
                    value={formData.externalQuestionSourceUrl}
                    onChange={(e) => updateField("externalQuestionSourceUrl", e.target.value)}
                    placeholder="https://api.example.com/survey-questions"
                    className="bg-white border-gray-200 flex-1"
                    data-testid="input-external-question-url"
                  />
                  <Button variant="outline" className="border-gray-200">
                    <Link2 className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Questions will be fetched from this endpoint
                </p>
              </div>
            )}

            {formData.questionSourceType === "manual" && (
              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-sm font-medium text-gray-900">Survey Questions</Label>
                  <Button variant="outline" size="sm" onClick={addQuestion} className="border-gray-200" data-testid="button-add-question">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
                <DraggableList
                  items={formData.surveyQuestions}
                  onReorder={(items) => updateField("surveyQuestions", items)}
                  renderItem={(question) => (
                    <div className="flex-1 flex items-center gap-3">
                      <Select
                        value={question.type}
                        onValueChange={(v) => {
                          const updated = formData.surveyQuestions.map((q) =>
                            q.id === question.id ? { ...q, type: v as SurveyQuestion["type"] } : q
                          );
                          updateField("surveyQuestions", updated);
                        }}
                      >
                        <SelectTrigger className="w-28 bg-white border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Rating">Rating</SelectItem>
                          <SelectItem value="Yes/No">Yes/No</SelectItem>
                          <SelectItem value="Text">Text</SelectItem>
                          <SelectItem value="Grade">Grade</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={question.text}
                        onChange={(e) => {
                          const updated = formData.surveyQuestions.map((q) =>
                            q.id === question.id ? { ...q, text: e.target.value } : q
                          );
                          updateField("surveyQuestions", updated);
                        }}
                        placeholder="Question text"
                        className="flex-1 bg-white border-gray-200"
                      />
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-gray-500">Required</Label>
                        <Switch
                          checked={question.required}
                          onCheckedChange={(v) => {
                            const updated = formData.surveyQuestions.map((q) =>
                              q.id === question.id ? { ...q, required: v } : q
                            );
                            updateField("surveyQuestions", updated);
                          }}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQuestion(question.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold text-gray-900">Outcome Rules</Label>
              <p className="text-sm text-gray-500 mb-4">
                Configure actions based on NPS response categories
              </p>
              
              <div className="space-y-4">
                {/* Detractors Card */}
                <Card className="p-6 bg-white border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-red-600 mb-1">Detractors (0-6)</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Actions for customers who gave low scores
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-gray-900">Create Fidspark Dispute</Label>
                      <Switch
                        checked={formData.outcomeRules.detractors.createFidsparkDispute}
                        onCheckedChange={(v) =>
                          updateField("outcomeRules", {
                            ...formData.outcomeRules,
                            detractors: { ...formData.outcomeRules.detractors, createFidsparkDispute: v },
                          })
                        }
                        data-testid="switch-fidspark"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-gray-900">Create Leadspark Task</Label>
                      <Switch
                        checked={formData.outcomeRules.detractors.createLeadsparkTask}
                        onCheckedChange={(v) =>
                          updateField("outcomeRules", {
                            ...formData.outcomeRules,
                            detractors: { ...formData.outcomeRules.detractors, createLeadsparkTask: v },
                          })
                        }
                        data-testid="switch-leadspark"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-gray-900">Create Webhook Task</Label>
                      <Switch
                        checked={formData.outcomeRules.detractors.createWebhookTask}
                        onCheckedChange={(v) =>
                          updateField("outcomeRules", {
                            ...formData.outcomeRules,
                            detractors: { ...formData.outcomeRules.detractors, createWebhookTask: v },
                          })
                        }
                        data-testid="switch-webhook"
                      />
                    </div>
                  </div>
                </Card>

                {/* Promoters Card */}
                <Card className="p-6 bg-white border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-green-600 mb-1">Promoters (9-10)</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Actions for satisfied customers
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-gray-900">Enable Review Channel Prompts</Label>
                      <Switch
                        checked={formData.outcomeRules.promoters.promptReviewChannels}
                        onCheckedChange={(v) =>
                          updateField("outcomeRules", {
                            ...formData.outcomeRules,
                            promoters: { promptReviewChannels: v },
                          })
                        }
                        data-testid="switch-review-prompt"
                      />
                    </div>
                    
                    {formData.outcomeRules.promoters.promptReviewChannels && (
                      <div className="pt-4 border-t border-gray-100">
                        <Label className="text-sm font-medium text-gray-900 mb-3 block">Review Channels</Label>
                        <p className="text-xs text-gray-500 mb-3">
                          Drag to reorder priority for promoter review requests
                        </p>
                        <DraggableList
                          items={formData.reviewChannels}
                          onReorder={(items) =>
                            updateField(
                              "reviewChannels",
                              items.map((item, index) => ({ ...item, priority: index + 1 }))
                            )
                          }
                          renderItem={(channel) => (
                            <div className="flex-1 flex items-center justify-between">
                              <span className="text-sm text-gray-900">{channel.platform}</span>
                              <Switch
                                checked={channel.enabled}
                                onCheckedChange={(v) => {
                                  const updated = formData.reviewChannels.map((c) =>
                                    c.id === channel.id ? { ...c, enabled: v } : c
                                  );
                                  updateField("reviewChannels", updated);
                                }}
                              />
                            </div>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </Card>

                {/* Passives Card */}
                <Card className="p-6 bg-white border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-amber-600 mb-1">Passives (7-8)</h4>
                  <p className="text-sm text-gray-500">
                    No automatic action configured for passive responses
                  </p>
                </Card>

                {/* External System Notification Card */}
                <Card className="p-6 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">External System Notification</h4>
                      <p className="text-sm text-gray-500">
                        Broadcast campaign results to external systems for integration and syncing
                      </p>
                    </div>
                    <Switch
                      checked={formData.outcomeRules.detractors.createWebhookTask}
                      onCheckedChange={(v) => {
                        updateField("outcomeRules", {
                          ...formData.outcomeRules,
                          detractors: { ...formData.outcomeRules.detractors, createWebhookTask: v },
                        });
                      }}
                      data-testid="switch-external-notification"
                    />
                  </div>
                  
                  {formData.outcomeRules.detractors.createWebhookTask && (
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <div>
                        <Label htmlFor="webhook-url" className="text-sm font-medium text-gray-900">Webhook URL *</Label>
                        <Input
                          id="webhook-url"
                          placeholder="https://api.external-system.com/campaigns/sync"
                          value={formData.outcomeRules.detractors.webhookUrl}
                          onChange={(e) =>
                            updateField("outcomeRules", {
                              ...formData.outcomeRules,
                              detractors: { ...formData.outcomeRules.detractors, webhookUrl: e.target.value },
                            })
                          }
                          className="mt-2 bg-white border-gray-200 text-sm"
                          data-testid="input-webhook-url"
                        />
                        <p className="text-xs text-gray-500 mt-1">The endpoint to receive campaign result notifications</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="webhook-secret" className="text-sm font-medium text-gray-900">Secret Key</Label>
                        <Input
                          id="webhook-secret"
                          placeholder="sk_live_..."
                          type="password"
                          value={formData.outcomeRules.detractors.webhookSecret}
                          onChange={(e) =>
                            updateField("outcomeRules", {
                              ...formData.outcomeRules,
                              detractors: { ...formData.outcomeRules.detractors, webhookSecret: e.target.value },
                            })
                          }
                          className="mt-2 bg-white border-gray-200 text-sm"
                          data-testid="input-webhook-secret"
                        />
                        <p className="text-xs text-gray-500 mt-1">Used to sign and verify webhook authenticity</p>
                      </div>

                      <div>
                        <Label htmlFor="webhook-payload" className="text-sm font-medium text-gray-900">Payload Template</Label>
                        <Textarea
                          id="webhook-payload"
                          placeholder='{"campaignId": "{{campaignId}}", "npsScore": "{{npsScore}}", "responseCount": "{{responseCount}}", "timestamp": "{{timestamp}}"}'
                          value={formData.outcomeRules.detractors.webhookPayloadTemplate}
                          onChange={(e) =>
                            updateField("outcomeRules", {
                              ...formData.outcomeRules,
                              detractors: { ...formData.outcomeRules.detractors, webhookPayloadTemplate: e.target.value },
                            })
                          }
                          className="mt-2 bg-white border-gray-200 text-sm"
                          rows={4}
                          data-testid="input-webhook-payload"
                        />
                        <p className="text-xs text-gray-500 mt-1">JSON template with dynamic fields: campaignId, npsScore, responseCount, timestamp, promotersPercent, detractorsPercent, passivesPercent</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                            Trigger Events
                          </div>
                        </Label>
                        <p className="text-xs text-gray-500 mb-2">Automatically send notifications on these events</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="trigger-completion" defaultChecked className="rounded border-gray-300" />
                            <Label htmlFor="trigger-completion" className="text-xs text-gray-700 cursor-pointer">On campaign completion</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="trigger-daily" defaultChecked className="rounded border-gray-300" />
                            <Label htmlFor="trigger-daily" className="text-xs text-gray-700 cursor-pointer">Daily summary updates</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="trigger-threshold" className="rounded border-gray-300" />
                            <Label htmlFor="trigger-threshold" className="text-xs text-gray-700 cursor-pointer">When NPS threshold changes</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/campaigns")}
              data-testid="button-back"
              className="h-9 w-9 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
              Create Campaign
            </h1>
          </div>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold whitespace-nowrap">
            Step {currentStep}/{WIZARD_STEPS.length}
          </span>
        </div>

        {/* Step Indicator - Wider container for better visibility */}
        <div className="mb-8 -mx-8 px-8">
          <div className="max-w-7xl mx-auto">
          <StepIndicator
            steps={WIZARD_STEPS}
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step < currentStep) {
                setCurrentStep(step);
              }
            }}
          />
          </div>
        </div>

        {/* Content Card */}
        <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          {renderStepContent()}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border-gray-200"
            data-testid="button-previous"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < 5 ? (
            <Button onClick={nextStep} className="bg-primary hover:bg-primary/90 text-white" data-testid="button-next">
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleLaunch} className="bg-primary hover:bg-primary/90 text-white" data-testid="button-launch">
              <Rocket className="h-4 w-4 mr-2" />
              Launch Campaign
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showServiceChangeDialog} onOpenChange={setShowServiceChangeDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Change Service Type?</DialogTitle>
            <DialogDescription className="text-gray-500">
              Changing the service type will replace your current survey questions with default
              questions for the new service type. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowServiceChangeDialog(false)} className="border-gray-200">
              Cancel
            </Button>
            <Button onClick={confirmServiceTypeChange} className="bg-primary hover:bg-primary/90 text-white">
              Change Service Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
