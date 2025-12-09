interface DistributionBarProps {
  label: string;
  value: number;
  color: string;
  count?: number;
}

export default function DistributionBar({ label, value, color, count }: DistributionBarProps) {
  return (
    <div className="space-y-2" data-testid={`bar-distribution-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-900">{label}</span>
        <span className="text-gray-500">
          {value}%{count !== undefined && ` (${count})`}
        </span>
      </div>
      {/* Slim height, rounded ends as per design system */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
