import { getNPSColor } from "@/lib/campaignStore";

interface NPSScoreDisplayProps {
  score: number;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
}

export default function NPSScoreDisplay({ score, size = "md", showLabel = true }: NPSScoreDisplayProps) {
  const colorClass = getNPSColor(score);
  
  const sizeClasses = {
    sm: "text-lg font-semibold",
    md: "text-2xl font-bold",
    lg: "text-4xl font-bold",
    xl: "text-5xl font-bold", // Big metrics style from design system
  };

  const labelSizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
    xl: "text-sm",
  };

  return (
    <div className="flex flex-col items-center" data-testid="nps-score-display">
      <span className={`${sizeClasses[size]} ${colorClass}`} data-testid="text-nps-value">
        {score}
      </span>
      {showLabel && (
        <span className={`${labelSizes[size]} text-gray-400 uppercase tracking-wider font-medium`}>
          NPS
        </span>
      )}
    </div>
  );
}
