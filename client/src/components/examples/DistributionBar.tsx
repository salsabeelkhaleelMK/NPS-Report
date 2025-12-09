import DistributionBar from '../campaigns/DistributionBar';

export default function DistributionBarExample() {
  return (
    <div className="space-y-4 w-full max-w-md">
      <DistributionBar label="Email" value={65} color="#2563eb" count={145} />
      <DistributionBar label="SMS" value={25} color="#8b5cf6" count={62} />
      <DistributionBar label="AI Call" value={10} color="#f59e0b" count={38} />
    </div>
  );
}
