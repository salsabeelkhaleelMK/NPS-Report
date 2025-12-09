import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface InsightsCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export default function InsightsCard({ 
  title, 
  icon, 
  children, 
  collapsible = false,
  defaultExpanded = true 
}: InsightsCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Card className="overflow-hidden" data-testid={`card-insights-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div 
        className={`
          flex items-center justify-between p-4 border-b border-border
          ${collapsible ? "cursor-pointer hover-elevate" : ""}
        `}
        onClick={() => collapsible && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {collapsible && (
          <button 
            type="button"
            className="text-muted-foreground"
            data-testid={`button-toggle-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        )}
      </div>
      
      {(!collapsible || expanded) && (
        <div className="p-4">
          {children}
        </div>
      )}
    </Card>
  );
}
