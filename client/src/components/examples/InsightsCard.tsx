import InsightsCard from '../campaigns/InsightsCard';
import { BarChart3 } from 'lucide-react';

export default function InsightsCardExample() {
  return (
    <InsightsCard 
      title="Response Sources" 
      icon={<BarChart3 className="h-5 w-5 text-primary" />}
      collapsible
    >
      <p className="text-sm text-muted-foreground">Content goes here...</p>
    </InsightsCard>
  );
}
