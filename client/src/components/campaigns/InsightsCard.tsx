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
    <Card 
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden" 
      data-testid={`card-insights-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div 
        className={`
          flex items-center justify-between p-6 border-b border-gray-100
          ${collapsible ? "cursor-pointer hover:bg-gray-50 transition-colors" : ""}
        `}
        onClick={() => collapsible && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-primary">{icon}</span>}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {collapsible && (
          <button 
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            data-testid={`button-toggle-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        )}
      </div>
      
      {(!collapsible || expanded) && (
        <div className="p-6">
          {children}
        </div>
      )}
    </Card>
  );
}
