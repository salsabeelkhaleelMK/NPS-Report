import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

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
    { name: "Promoters (9-10)", value: promotersPercent, color: "#4CAF50" },
    { name: "Passives (7-8)", value: passivesPercent, color: "#F59E0B" },
    { name: "Detractors (0-6)", value: detractorsPercent, color: "rgb(249, 0, 50)" },
  ];

  // Use primary (burnt orange) color for the NPS score as per design system
  const scoreColor = "#E64A19";

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
              backgroundColor: '#fff', 
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center NPS Score with primary (burnt orange) color */}
      <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <span 
          className="text-5xl font-bold" 
          style={{ color: scoreColor }}
          data-testid="text-nps-center"
        >
          {npsScore}
        </span>
        <p className="text-xs text-gray-400 uppercase tracking-wider mt-1 font-medium">NPS Score</p>
      </div>
    </div>
  );
}
