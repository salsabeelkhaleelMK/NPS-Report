import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { getNPSColor } from "@/lib/campaignStore";

interface NPSDonutChartProps {
  promotersPercent: number;
  passivesPercent: number;
  detractorsPercent: number;
  npsScore: number;
}

export default function NPSDonutChart({ 
  promotersPercent, 
  passivesPercent, 
  detractorsPercent,
  npsScore 
}: NPSDonutChartProps) {
  const data = [
    { name: "Promoters (9-10)", value: promotersPercent, color: "#22c55e" },
    { name: "Passives (7-8)", value: passivesPercent, color: "#f59e0b" },
    { name: "Detractors (0-6)", value: detractorsPercent, color: "#ef4444" },
  ];

  const colorClass = getNPSColor(npsScore);

  return (
    <div className="relative w-full h-[280px]" data-testid="chart-nps-donut">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value}%`, ""]}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--popover))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-xs text-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <span className={`text-4xl font-bold ${colorClass}`} data-testid="text-nps-center">
          {npsScore}
        </span>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">NPS Score</p>
      </div>
    </div>
  );
}
