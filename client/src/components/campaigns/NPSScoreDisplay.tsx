import { getNPSColor } from "@/lib/campaignStore";

interface NPSScoreDisplayProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function NPSScoreDisplay({ score, size = "md", showLabel = true }: NPSScoreDisplayProps) {
  const colorClass = getNPSColor(score);
  
  const sizeClasses = {
    sm: "text-lg font-semibold",
    md: "text-2xl font-bold",
    lg: "text-4xl font-bold",
  };

  return (
    <div className="flex items-center gap-1" data-testid="nps-score-display">
      <span className={`${sizeClasses[size]} ${colorClass}`} data-testid="text-nps-value">
        {score}
      </span>
      {showLabel && (
        <span className="text-xs text-muted-foreground uppercase tracking-wide">NPS</span>
      )}
    </div>
  );
}
