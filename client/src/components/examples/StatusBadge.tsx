import StatusBadge from '../campaigns/StatusBadge';

export default function StatusBadgeExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <StatusBadge status="Active" />
      <StatusBadge status="Paused" />
      <StatusBadge status="Draft" />
      <StatusBadge status="Completed" />
    </div>
  );
}
