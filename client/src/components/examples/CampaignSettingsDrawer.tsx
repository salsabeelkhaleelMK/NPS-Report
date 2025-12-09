import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CampaignSettingsDrawer from '../campaigns/CampaignSettingsDrawer';
import { getCampaigns } from '@/lib/campaignStore';

export default function CampaignSettingsDrawerExample() {
  const [open, setOpen] = useState(false);
  const campaigns = getCampaigns();
  const campaign = campaigns[0];

  if (!campaign) {
    return <p>No campaigns available</p>;
  }

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Settings</Button>
      <CampaignSettingsDrawer
        campaign={campaign}
        open={open}
        onOpenChange={setOpen}
        onSave={(c) => console.log('Saved:', c)}
      />
    </div>
  );
}
