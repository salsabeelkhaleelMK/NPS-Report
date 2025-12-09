import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Campaign, TriggerType, VoiceType, SurveyQuestion } from "@/lib/types";
import { updateCampaign } from "@/lib/campaignStore";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, Phone, Trash2, Plus, Link2 } from "lucide-react";
import DraggableList from "./DraggableList";
import { v4 as uuidv4 } from "uuid";

interface CampaignSettingsDrawerProps {
  campaign: Campaign;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (campaign: Campaign) => void;
}

export default function CampaignSettingsDrawer({
  campaign,
  open,
  onOpenChange,
  onSave,
}: CampaignSettingsDrawerProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Campaign>(campaign);
  const [activeTab, setActiveTab] = useState("basics");
  const [basicsOpenItems, setBasicsOpenItems] = useState(["basic-info", "survey-questions"]);
  const [outcomesOpenItems, setOutcomesOpenItems] = useState(["outcome-rules"]);

  useEffect(() => {
    setFormData(campaign);
  }, [campaign]);

  const handleSave = () => {
    const updated = updateCampaign(campaign.id, formData);
    if (updated) {
      onSave(updated);
      toast({ title: "Changes saved", description: "Campaign has been updated." });
      onOpenChange(false);
    }
  };

  const updateField = <K extends keyof Campaign>(field: K, value: Campaign[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isRunning = campaign.status === "Active";

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[448px] overflow-y-auto" data-testid="drawer-edit">
        <SheetHeader>
          <SheetTitle>Edit Campaign</SheetTitle>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto gap-0">
            <TabsTrigger
              value="basics"
              className="rounded-none border-b-2 data-[state=active]:border-b-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=inactive]:border-b-transparent data-[state=inactive]:bg-transparent py-2"
              data-testid="tab-basics"
            >
              Basics
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="rounded-none border-b-2 data-[state=active]:border-b-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=inactive]:border-b-transparent data-[state=inactive]:bg-transparent py-2"
              data-testid="tab-timeline"
            >
              Timeline
            </TabsTrigger>
            <TabsTrigger
              value="outcomes"
              className="rounded-none border-b-2 data-[state=active]:border-b-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=inactive]:border-b-transparent data-[state=inactive]:bg-transparent py-2"
              data-testid="tab-outcomes"
            >
              Outcomes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="mt-4 space-y-4">
            <Accordion type="single" value={basicsOpenItems[0] || "basic-info"} onValueChange={(val) => setBasicsOpenItems(val ? [val] : [])} className="space-y-2">
              <AccordionItem value="basic-info" className="border rounded-md px-4">
                <AccordionTrigger className="text-sm font-medium">Basic Information</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div>
                    <Label htmlFor="name">Campaign Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="bg-white mt-1"
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      className="bg-white mt-1"
                      data-testid="input-description"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date">Start Date {!isRunning && "*"}</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={formData.startDate.toISOString().split("T")[0]}
                        onChange={(e) => updateField("startDate", new Date(e.target.value))}
                        className="bg-white mt-1"
                        disabled={isRunning}
                        data-testid="input-start-date"
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={formData.endDate.toISOString().split("T")[0]}
                        onChange={(e) => updateField("endDate", new Date(e.target.value))}
                        className="bg-white mt-1"
                        data-testid="input-end-date"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Trigger Type</Label>
                    <Select
                      value={formData.triggerType}
                      onValueChange={(v) => updateField("triggerType", v as TriggerType)}
                    >
                      <SelectTrigger className="bg-white mt-1" data-testid="select-trigger-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Immediate">Immediate</SelectItem>
                        <SelectItem value="Delayed">Delayed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.triggerType === "Delayed" && (
                    <div>
                      <Label htmlFor="delay">Delay Hours</Label>
                      <Input
                        id="delay"
                        type="number"
                        value={formData.delayHours}
                        onChange={(e) => updateField("delayHours", parseInt(e.target.value) || 0)}
                        className="bg-white mt-1"
                        data-testid="input-delay-hours"
                      />
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="survey-questions" className="border rounded-md px-4">
                <AccordionTrigger className="text-sm font-medium">Survey Questions</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  {(formData as any).questionSourceType === "external" && (formData as any).externalQuestionSourceUrl && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
                      <div className="flex items-start gap-2">
                        <Link2 className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">External Source Connected</p>
                          <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1 break-all">{(formData as any).externalQuestionSourceUrl}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {(formData as any).questionSourceType === "manual" && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Questions</Label>
                        <Button variant="outline" size="sm" onClick={addQuestion} data-testid="button-add-question">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </div>
                      <DraggableList
                        items={formData.surveyQuestions}
                        onReorder={(items) => updateField("surveyQuestions", items)}
                        renderItem={(question) => (
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <Input
                                value={question.text}
                                onChange={(e) => {
                                  const updated = formData.surveyQuestions.map((q) =>
                                    q.id === question.id ? { ...q, text: e.target.value } : q
                                  );
                                  updateField("surveyQuestions", updated);
                                }}
                                placeholder="Question text"
                                className="flex-1 bg-white text-sm"
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <Select
                                value={question.type}
                                onValueChange={(v) => {
                                  const updated = formData.surveyQuestions.map((q) =>
                                    q.id === question.id ? { ...q, type: v as SurveyQuestion["type"] } : q
                                  );
                                  updateField("surveyQuestions", updated);
                                }}
                              >
                                <SelectTrigger className="w-32 bg-white text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Rating">Rating</SelectItem>
                                  <SelectItem value="Yes/No">Yes/No</SelectItem>
                                  <SelectItem value="Text">Text</SelectItem>
                                  <SelectItem value="Grade">Grade</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="flex items-center gap-1">
                                <Label className="text-xs text-muted-foreground">Required</Label>
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
                                className="text-muted-foreground"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      />
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="timeline" className="mt-4 space-y-4">
            <Accordion type="single" defaultValue={formData.followUpSteps.length === 1 ? formData.followUpSteps[0].id : undefined} className="space-y-2">
              {formData.followUpSteps.map((step, index) => (
                <AccordionItem key={step.id} value={step.id} className="border rounded-md px-4">
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {step.actionType === "Send Email" && <Mail className="h-4 w-4" />}
                      {step.actionType === "Send SMS" && <MessageSquare className="h-4 w-4" />}
                      {step.actionType === "Send AI Call" && <Phone className="h-4 w-4" />}
                      <span>Step {index + 1}: {step.actionType}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    {step.actionType === "Send Email" && (
                      <>
                        <div>
                          <Label>Subject</Label>
                          <Input
                            value={(step.configuration?.emailSubject as string) || ""}
                            onChange={(e) => {
                              const updated = formData.followUpSteps.map((s) =>
                                s.id === step.id
                                  ? { ...s, configuration: { ...s.configuration, emailSubject: e.target.value } }
                                  : s
                              );
                              updateField("followUpSteps", updated);
                            }}
                            className="bg-white text-sm"
                            placeholder="Email subject"
                          />
                        </div>
                        <div>
                          <Label>Body</Label>
                          <Textarea
                            value={(step.configuration?.emailBody as string) || ""}
                            onChange={(e) => {
                              const updated = formData.followUpSteps.map((s) =>
                                s.id === step.id
                                  ? { ...s, configuration: { ...s.configuration, emailBody: e.target.value } }
                                  : s
                              );
                              updateField("followUpSteps", updated);
                            }}
                            className="bg-white text-sm"
                            placeholder="Email body"
                            rows={3}
                          />
                        </div>
                      </>
                    )}

                    {step.actionType === "Send SMS" && (
                      <div>
                        <Label>SMS Body</Label>
                        <Textarea
                          value={(step.configuration?.smsBody as string) || ""}
                          onChange={(e) => {
                            const updated = formData.followUpSteps.map((s) =>
                              s.id === step.id
                                ? { ...s, configuration: { ...s.configuration, smsBody: e.target.value } }
                                : s
                            );
                            updateField("followUpSteps", updated);
                          }}
                          className="bg-white text-sm"
                          placeholder="SMS body"
                          rows={2}
                        />
                      </div>
                    )}

                    {step.actionType === "Send AI Call" && (
                      <div className="space-y-6">
                        <div className="text-sm text-muted-foreground">AI Agent Configuration</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Start After (hours)</Label>
                            <Input
                              type="number"
                              value={formData.aiAgentSettings.startAfterHours}
                              onChange={(e) =>
                                updateField("aiAgentSettings", {
                                  ...formData.aiAgentSettings,
                                  startAfterHours: parseInt(e.target.value) || 0,
                                })
                              }
                              className="bg-white mt-1 text-sm"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Hours to wait before first call</p>
                          </div>
                          <div>
                            <Label>Retry Interval (hours)</Label>
                            <Input
                              type="number"
                              value={formData.aiAgentSettings.retryIntervalHours}
                              onChange={(e) =>
                                updateField("aiAgentSettings", {
                                  ...formData.aiAgentSettings,
                                  retryIntervalHours: parseInt(e.target.value) || 0,
                                })
                              }
                              className="bg-white mt-1 text-sm"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Hours between retries</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Max Retries</Label>
                            <Input
                              type="number"
                              value={formData.aiAgentSettings.maxRetries}
                              onChange={(e) =>
                                updateField("aiAgentSettings", {
                                  ...formData.aiAgentSettings,
                                  maxRetries: parseInt(e.target.value) || 0,
                                })
                              }
                              className="bg-white mt-1 text-sm"
                            />
                          </div>
                          <div>
                            <Label>Voice Type</Label>
                            <Select
                              value={formData.aiAgentSettings.voiceType}
                              onValueChange={(v) =>
                                updateField("aiAgentSettings", { ...formData.aiAgentSettings, voiceType: v as VoiceType })
                              }
                            >
                              <SelectTrigger className="bg-white mt-1 text-sm">
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
                            <Label>Call Window From</Label>
                            <Input
                              type="time"
                              value={formData.aiAgentSettings.callWindowFrom}
                              onChange={(e) =>
                                updateField("aiAgentSettings", {
                                  ...formData.aiAgentSettings,
                                  callWindowFrom: e.target.value,
                                })
                              }
                              className="bg-white mt-1 text-sm"
                            />
                          </div>
                          <div>
                            <Label>Call Window To</Label>
                            <Input
                              type="time"
                              value={formData.aiAgentSettings.callWindowTo}
                              onChange={(e) =>
                                updateField("aiAgentSettings", {
                                  ...formData.aiAgentSettings,
                                  callWindowTo: e.target.value,
                                })
                              }
                              className="bg-white mt-1 text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Persona Script</Label>
                          <Textarea
                            value={formData.aiAgentSettings.personaScript}
                            onChange={(e) =>
                              updateField("aiAgentSettings", {
                                ...formData.aiAgentSettings,
                                personaScript: e.target.value,
                              })
                            }
                            className="bg-white mt-1 text-sm"
                            rows={3}
                            placeholder="Hello, this is Sarah from AutoHaus..."
                          />
                          <p className="text-xs text-muted-foreground mt-1">The script the AI agent will use</p>
                        </div>

                        <div className="pt-4 border-t border-border">
                          <Label className="text-sm font-medium mb-3 block">Human Escalation Triggers</Label>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-sm">On Call Failure</Label>
                                <p className="text-xs text-muted-foreground">Escalate on failure</p>
                              </div>
                              <Switch
                                checked={formData.aiAgentSettings.triggerHumanFollowUpOnFailure}
                                onCheckedChange={(v) =>
                                  updateField("aiAgentSettings", {
                                    ...formData.aiAgentSettings,
                                    triggerHumanFollowUpOnFailure: v,
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-sm">On Dissatisfaction</Label>
                                <p className="text-xs text-muted-foreground">Customer unhappy</p>
                              </div>
                              <Switch
                                checked={formData.aiAgentSettings.triggerHumanFollowUpOnDissatisfaction}
                                onCheckedChange={(v) =>
                                  updateField("aiAgentSettings", {
                                    ...formData.aiAgentSettings,
                                    triggerHumanFollowUpOnDissatisfaction: v,
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-sm">On Verbal Complaint</Label>
                                <p className="text-xs text-muted-foreground">Complaint detected</p>
                              </div>
                              <Switch
                                checked={formData.aiAgentSettings.triggerHumanFollowUpOnVerbalComplaint}
                                onCheckedChange={(v) =>
                                  updateField("aiAgentSettings", {
                                    ...formData.aiAgentSettings,
                                    triggerHumanFollowUpOnVerbalComplaint: v,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="outcomes" className="mt-4 space-y-4">
            <Accordion type="single" value={outcomesOpenItems[0] || "outcome-rules"} onValueChange={(val) => setOutcomesOpenItems(val ? [val] : [])} className="space-y-2">
              <AccordionItem value="outcome-rules" className="border rounded-md px-4">
                <AccordionTrigger className="text-sm font-medium">Outcome Rules</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-3">Detractors (0-6)</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Create Fidspark Dispute</Label>
                        <Switch
                          checked={formData.outcomeRules.detractors.createFidsparkDispute}
                          onCheckedChange={(v) =>
                            updateField("outcomeRules", {
                              ...formData.outcomeRules,
                              detractors: { ...formData.outcomeRules.detractors, createFidsparkDispute: v },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Create Leadspark Task</Label>
                        <Switch
                          checked={formData.outcomeRules.detractors.createLeadsparkTask}
                          onCheckedChange={(v) =>
                            updateField("outcomeRules", {
                              ...formData.outcomeRules,
                              detractors: { ...formData.outcomeRules.detractors, createLeadsparkTask: v },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Create Webhook Task</Label>
                        <Switch
                          checked={formData.outcomeRules.detractors.createWebhookTask}
                          onCheckedChange={(v) =>
                            updateField("outcomeRules", {
                              ...formData.outcomeRules,
                              detractors: { ...formData.outcomeRules.detractors, createWebhookTask: v },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-3">Promoters (9-10)</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Prompt Review Channels</Label>
                        <Switch
                          checked={formData.outcomeRules.promoters.promptReviewChannels}
                          onCheckedChange={(v) =>
                            updateField("outcomeRules", {
                              ...formData.outcomeRules,
                              promoters: { promptReviewChannels: v },
                            })
                          }
                        />
                      </div>

                      {formData.outcomeRules.promoters.promptReviewChannels && (
                        <div className="pt-4 border-t border-border">
                          <Label className="text-sm font-medium mb-3 block">Review Channels</Label>
                          <p className="text-xs text-muted-foreground mb-3">Drag to reorder priority</p>
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
                                <span className="text-sm">{channel.platform}</span>
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

                    <div className="pt-6 border-t border-border">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <Label className="text-sm font-medium">External System Notification</Label>
                          <p className="text-xs text-muted-foreground mt-1">Broadcast results to external systems</p>
                        </div>
                        <Switch
                          checked={formData.outcomeRules.detractors.createWebhookTask}
                          onCheckedChange={(v) =>
                            updateField("outcomeRules", {
                              ...formData.outcomeRules,
                              detractors: { ...formData.outcomeRules.detractors, createWebhookTask: v },
                            })
                          }
                        />
                      </div>
                      
                      {formData.outcomeRules.detractors.createWebhookTask && (
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="webhook-url-edit" className="text-xs font-medium">Webhook URL</Label>
                            <Input
                              id="webhook-url-edit"
                              placeholder="https://api.external-system.com/sync"
                              value={formData.outcomeRules.detractors.webhookUrl}
                              onChange={(e) =>
                                updateField("outcomeRules", {
                                  ...formData.outcomeRules,
                                  detractors: { ...formData.outcomeRules.detractors, webhookUrl: e.target.value },
                                })
                              }
                              className="bg-white mt-1 text-sm"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="webhook-secret-edit" className="text-xs font-medium">Secret Key</Label>
                            <Input
                              id="webhook-secret-edit"
                              placeholder="sk_live_..."
                              type="password"
                              value={formData.outcomeRules.detractors.webhookSecret}
                              onChange={(e) =>
                                updateField("outcomeRules", {
                                  ...formData.outcomeRules,
                                  detractors: { ...formData.outcomeRules.detractors, webhookSecret: e.target.value },
                                })
                              }
                              className="bg-white mt-1 text-sm"
                            />
                          </div>

                          <div>
                            <Label htmlFor="webhook-payload-edit" className="text-xs font-medium">Payload Template</Label>
                            <Textarea
                              id="webhook-payload-edit"
                              placeholder='{"campaignId": "{{campaignId}}", "npsScore": "{{npsScore}}"}'
                              value={formData.outcomeRules.detractors.webhookPayloadTemplate}
                              onChange={(e) =>
                                updateField("outcomeRules", {
                                  ...formData.outcomeRules,
                                  detractors: { ...formData.outcomeRules.detractors, webhookPayloadTemplate: e.target.value },
                                })
                              }
                              className="bg-white mt-1 text-sm"
                              rows={3}
                            />
                            <p className="text-xs text-muted-foreground mt-1">Available: campaignId, npsScore, responseCount, promotersPercent, detractorsPercent, passivesPercent, timestamp</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-slate-900" data-testid="button-save-settings">
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
