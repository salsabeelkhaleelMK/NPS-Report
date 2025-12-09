import { useEffect } from 'react';
import { getCampaigns } from '@/lib/campaignStore';

export default function CampaignDetailExample() {
  const campaigns = getCampaigns();
  
  useEffect(() => {
    if (campaigns.length > 0) {
      window.history.replaceState(null, '', `/campaigns/${campaigns[0].id}`);
    }
  }, [campaigns]);

  if (campaigns.length === 0) {
    return <p>No campaigns to display</p>;
  }

  return (
    <p className="text-sm text-muted-foreground">
      Navigate to /campaigns/{campaigns[0]?.id} to view the detail page
    </p>
  );
}
