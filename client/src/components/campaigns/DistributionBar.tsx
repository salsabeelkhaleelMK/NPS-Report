interface DistributionBarProps {
  label: string;
  value: number;
  color: string;
  count?: number;
}

export default function DistributionBar({ label, value, color, count }: DistributionBarProps) {
  return (
    <div className="space-y-1" data-testid={`bar-distribution-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {value}%{count !== undefined && ` (${count})`}
        </span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
