import { useState, useMemo } from "react";
import { format, isSameDay } from "date-fns";
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle,
  Pause,
  SkipForward,
  Square,
  Star,
  User,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: "action" | "decision" | "outcome" | "scheduled";
  status: "completed" | "in-progress" | "scheduled" | "paused" | "skipped" | "cancelled";
  title: string;
  description: string;
  contactName: string;
  contactId: string;
  metadata?: {
    rating?: number;
    channel?: string;
    duration?: number;
  };
}

interface CampaignLogProps {
  campaignId: string;
}

// Mock data - in production, this would come from an API
const generateMockEvents = (): TimelineEvent[] => {
  const now = new Date();
  const events: TimelineEvent[] = [];
  const contacts = [
    { id: "1", name: "John Smith" },
    { id: "2", name: "Sarah Johnson" },
    { id: "3", name: "Michael Brown" },
    { id: "4", name: "Emily Davis" },
    { id: "5", name: "David Wilson" },
  ];

  // Generate events for the last 7 days
  for (let i = 0; i < 30; i++) {
    const contact = contacts[Math.floor(Math.random() * contacts.length)];
    const daysAgo = Math.floor(Math.random() * 7);
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = new Date(now.getTime() - (daysAgo * 24 + hoursAgo) * 60 * 60 * 1000);
    
    const eventTypes: Array<{ type: TimelineEvent["type"]; status: TimelineEvent["status"]; title: string; description: string }> = [
      { type: "action", status: "completed", title: "Agent sent Email", description: `Email sent to ${contact.name}` },
      { type: "action", status: "completed", title: "Agent sent SMS", description: `SMS sent to ${contact.name}` },
      { type: "action", status: "in-progress", title: "AI Call initiated", description: `AI Call in progress with ${contact.name}` },
      { type: "decision", status: "completed", title: "No response detected", description: `No response from ${contact.name}, proceeding to SMS` },
      { type: "decision", status: "completed", title: "SMS ignored", description: `SMS not responded, proceeding to AI Call` },
      { type: "outcome", status: "completed", title: "Customer rated", description: `${contact.name} provided feedback`, metadata: { rating: Math.floor(Math.random() * 10) + 1 } },
      { type: "scheduled", status: "scheduled", title: "Follow-up task: Human agent review", description: `Scheduled review for ${contact.name}` },
    ];

    const eventTemplate = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    events.push({
      id: `event-${i}`,
      timestamp,
      type: eventTemplate.type,
      status: eventTemplate.status,
      title: eventTemplate.title,
      description: eventTemplate.description,
      contactName: contact.name,
      contactId: contact.id,
      metadata: eventTemplate.metadata,
    });
  }

  // Sort by timestamp (oldest first)
  return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

export default function CampaignLog({ campaignId }: CampaignLogProps) {
  const [events] = useState<TimelineEvent[]>(generateMockEvents());
  const [pausedEvents, setPausedEvents] = useState<Set<string>>(new Set());
  const [skippedEvents, setSkippedEvents] = useState<Set<string>>(new Set());
  const [cancelledEvents, setCancelledEvents] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const handlePause = (eventId: string) => {
    setPausedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  };

  const handleSkip = (eventId: string) => {
    setSkippedEvents((prev) => new Set(prev).add(eventId));
  };

  const handleCancel = (eventId: string) => {
    setCancelledEvents((prev) => new Set(prev).add(eventId));
  };

  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "action":
        return Mail;
      case "decision":
        return AlertCircle;
      case "outcome":
        return CheckCircle2;
      case "scheduled":
        return Clock;
      default:
        return CheckCircle2;
    }
  };

  const getStatusColor = (status: TimelineEvent["status"], eventId: string) => {
    if (cancelledEvents.has(eventId)) return "bg-gray-100 border-gray-300 text-gray-600";
    if (skippedEvents.has(eventId)) return "bg-gray-100 border-gray-300 text-gray-600";
    if (pausedEvents.has(eventId)) return "bg-amber-50 border-amber-300 text-amber-700";
    
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-300 text-green-700";
      case "in-progress":
        return "bg-blue-50 border-blue-300 text-blue-700";
      case "scheduled":
        return "bg-gray-50 border-gray-300 text-gray-700";
      case "paused":
        return "bg-amber-50 border-amber-300 text-amber-700";
      default:
        return "bg-gray-50 border-gray-300 text-gray-700";
    }
  };

  const getTypeBadgeColor = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "action":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "decision":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "outcome":
        return "bg-green-100 text-green-800 border-green-200";
      case "scheduled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadge = (status: TimelineEvent["status"], eventId: string) => {
    if (cancelledEvents.has(eventId)) {
      return <Badge className="bg-gray-100 text-gray-700 border-gray-200 text-xs">Cancelled</Badge>;
    }
    if (skippedEvents.has(eventId)) {
      return <Badge className="bg-gray-100 text-gray-700 border-gray-200 text-xs">Skipped</Badge>;
    }
    if (pausedEvents.has(eventId)) {
      return <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">Paused</Badge>;
    }

    switch (status) {
      case "completed":
        return null; // No badge for completed
      case "in-progress":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs animate-pulse">
            Live
          </Badge>
        );
      case "scheduled":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200 text-xs">Scheduled</Badge>;
      default:
        return null;
    }
  };

  // Filter events based on search query
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    
    const query = searchQuery.toLowerCase();
    return events.filter((event) =>
      event.contactName.toLowerCase().includes(query) ||
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.type.toLowerCase().includes(query)
    );
  }, [events, searchQuery]);

  // Group filtered events by date
  const groupedEvents = useMemo(() => {
    return filteredEvents.reduce((acc, event) => {
      const dateKey = format(event.timestamp, "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {} as Record<string, TimelineEvent[]>);
  }, [filteredEvents]);

  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Campaign Activity Timeline</h3>
        <p className="text-sm text-gray-500">Chronological log of all actions across all contacts</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Search by contact name, event title, description, or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11 bg-white border-gray-200 rounded-lg h-11 text-gray-900 placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2">
        {Object.entries(groupedEvents).map(([dateKey, dayEvents]) => {
          const date = new Date(dateKey + "T00:00:00");
          const isToday = isSameDay(date, new Date());
          
          return (
            <div key={dateKey} className="relative">
              {/* Date Header */}
              <div className="sticky top-0 bg-white z-10 pb-2 mb-4 border-b border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900">
                  {isToday ? "Today" : format(date, "EEEE, MMMM d, yyyy")}
                </h4>
              </div>

              {/* Timeline Events */}
              <div className="relative pl-8 space-y-4">
                {/* Timeline line */}
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />
                
                {dayEvents.map((event, index) => {
                  const Icon = getEventIcon(event.type);
                  const isLast = index === dayEvents.length - 1;
                  const isPaused = pausedEvents.has(event.id);
                  const isSkipped = skippedEvents.has(event.id);
                  const isCancelled = cancelledEvents.has(event.id);
                  const isInProgress = event.status === "in-progress" && !isPaused && !isSkipped && !isCancelled;

                  return (
                    <div key={event.id} className="relative">
                      {/* Timeline dot */}
                      <div className={`absolute left-0 top-1.5 w-2 h-2 rounded-full border-2 ${
                        isInProgress 
                          ? "bg-blue-500 border-blue-500 animate-pulse" 
                          : getStatusColor(event.status, event.id).includes("green")
                          ? "bg-green-500 border-green-500"
                          : getStatusColor(event.status, event.id).includes("amber")
                          ? "bg-amber-500 border-amber-500"
                          : "bg-gray-400 border-gray-400"
                      }`} />
                      
                      {/* Event Card */}
                      <div className={`ml-6 p-4 rounded-lg border ${getStatusColor(event.status, event.id)} transition-all`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="h-4 w-4 flex-shrink-0" />
                              <span className="text-sm font-semibold text-gray-900">{event.title}</span>
                              <Badge className={`${getTypeBadgeColor(event.type)} text-xs`}>
                                {event.type}
                              </Badge>
                              {getStatusBadge(event.status, event.id)}
                            </div>
                            
                            <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{event.contactName}</span>
                              </div>
                              <span>{format(event.timestamp, "h:mm a")}</span>
                            </div>

                            {/* Rating display */}
                            {event.metadata?.rating && (
                              <div className="mt-2 flex items-center gap-1">
                                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                <span className="text-xs font-medium text-gray-700">
                                  {event.metadata.rating}/10
                                </span>
                                <div className="flex gap-0.5 ml-2">
                                  {Array.from({ length: 10 }).map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        i < event.metadata!.rating!
                                          ? "bg-amber-500"
                                          : "bg-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action buttons */}
                          {!isCancelled && (event.status === "in-progress" || event.status === "scheduled") && (
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {event.status === "in-progress" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-gray-500 hover:text-amber-600"
                                  onClick={() => handlePause(event.id)}
                                  title={isPaused ? "Resume" : "Pause"}
                                >
                                  <Pause className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-500 hover:text-gray-700"
                                onClick={() => handleSkip(event.id)}
                                title="Skip"
                              >
                                <SkipForward className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-500 hover:text-red-600"
                                onClick={() => handleCancel(event.id)}
                                title="Cancel"
                              >
                                <Square className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(groupedEvents).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found matching your search.</p>
        </div>
      )}
    </Card>
  );
}

