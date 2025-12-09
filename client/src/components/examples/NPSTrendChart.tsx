import NPSTrendChart from '../campaigns/NPSTrendChart';

// todo: remove mock functionality
const mockData = [
  { date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), score: 68 },
  { date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), score: 70 },
  { date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), score: 69 },
  { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), score: 74 },
  { date: new Date(), score: 72 },
];

export default function NPSTrendChartExample() {
  return <NPSTrendChart data={mockData} />;
}
