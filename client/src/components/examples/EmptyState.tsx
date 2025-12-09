import EmptyState from '../campaigns/EmptyState';

export default function EmptyStateExample() {
  return (
    <EmptyState 
      title="No campaigns yet"
      description="Get started by creating your first NPS campaign to collect customer feedback."
      actionLabel="Create New Campaign"
      onAction={() => console.log('Create clicked')}
    />
  );
}
