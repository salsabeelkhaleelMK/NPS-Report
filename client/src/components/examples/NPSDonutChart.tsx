import NPSDonutChart from '../campaigns/NPSDonutChart';

export default function NPSDonutChartExample() {
  return (
    <NPSDonutChart 
      promotersPercent={58} 
      passivesPercent={22} 
      detractorsPercent={20} 
      npsScore={72} 
    />
  );
}
