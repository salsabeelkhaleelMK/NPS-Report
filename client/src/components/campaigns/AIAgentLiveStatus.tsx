import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pause, Play, Clock, Phone, AlertCircle, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AIAgentLiveStatusProps {
  campaignId: string;
}

interface AgentStatus {
  waitingForInput: number;
  attemptingContact: number;
  activeCalls: number;
  escalatedToHuman: number;
  isPaused: boolean;
}

export default function AIAgentLiveStatus({ campaignId }: AIAgentLiveStatusProps) {
  const [status, setStatus] = useState<AgentStatus>({
    waitingForInput: 0,
    attemptingContact: 0,
    activeCalls: 0,
    escalatedToHuman: 0,
    isPaused: false,
  });

  // Simulate live updates - in production, this would be WebSocket or polling
  useEffect(() => {
    // Mock data - replace with real API calls
    const mockStatus: AgentStatus = {
      waitingForInput: 0,
      attemptingContact: 5,
      activeCalls: 3,
      escalatedToHuman: 2,
      isPaused: false,
    };
    setStatus(mockStatus);

    // Simulate live updates every 5 seconds
    const interval = setInterval(() => {
      setStatus((prev) => ({
        ...prev,
        // Simulate some variation in numbers
        activeCalls: Math.max(0, prev.activeCalls + Math.floor(Math.random() * 3) - 1),
        attemptingContact: Math.max(0, prev.attemptingContact + Math.floor(Math.random() * 3) - 1),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [campaignId]);

  const handlePauseToggle = () => {
    setStatus((prev) => ({ ...prev, isPaused: !prev.isPaused }));
    // In production, this would call an API to pause/resume
  };

  const statusItems = [
    {
      label: "Waiting for Input",
      count: status.waitingForInput,
      icon: Clock,
      color: "text-gray-500",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
    {
      label: "Attempting Contact",
      description: "SMS/Email sent, timer running",
      count: status.attemptingContact,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      label: "Currently on AI Call",
      description: "active calls",
      count: status.activeCalls,
      icon: Phone,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      label: "Escalated to Human",
      description: "Action Required",
      count: status.escalatedToHuman,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ];

  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">AI Agent Live Status</h3>
          <p className="text-sm text-gray-500">Real-time status of active AI agent operations</p>
        </div>
        <Button
          onClick={handlePauseToggle}
          variant={status.isPaused ? "default" : "outline"}
          size="sm"
          className={status.isPaused ? "bg-primary hover:bg-primary/90 text-white" : "border-gray-200"}
        >
          {status.isPaused ? (
            <>
              <Play className="h-4 w-4 mr-2" />
              Resume All Outbound AI Calls
            </>
          ) : (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause All Outbound AI Calls
            </>
          )}
        </Button>
      </div>

      {status.isPaused && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 text-amber-800">
            <Pause className="h-4 w-4" />
            <span className="text-sm font-medium">All outbound AI calls are currently paused</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`p-4 rounded-lg border ${item.borderColor} ${item.bgColor} transition-all hover:shadow-sm`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                {item.count > 0 && (
                  <Badge
                    variant="outline"
                    className={`${item.color} ${item.borderColor} bg-white font-semibold`}
                  >
                    {item.count}
                  </Badge>
                )}
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">{item.label}</h4>
              {item.description && (
                <p className="text-xs text-gray-500">{item.description}</p>
              )}
              {item.count === 0 && (
                <p className="text-xs text-gray-400 mt-1">({item.count})</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Active</p>
            <p className="text-2xl font-bold text-gray-900">
              {status.waitingForInput + status.attemptingContact + status.activeCalls + status.escalatedToHuman}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">In Progress</p>
            <p className="text-2xl font-bold text-primary">
              {status.attemptingContact + status.activeCalls}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Needs Attention</p>
            <p className="text-2xl font-bold text-red-600">
              {status.escalatedToHuman}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</p>
            <p className="text-lg font-semibold">
              {status.isPaused ? (
                <span className="text-amber-600">Paused</span>
              ) : (
                <span className="text-green-600">Active</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}



