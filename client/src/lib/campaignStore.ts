/**
 * Campaign Store - Data access layer
 * 
 * BEST PRACTICE: Store operations are separated from mock/seed data.
 * This file contains ONLY data access logic (CRUD operations).
 * Mock data is imported from mockData.ts for clean separation.
 */

import { Campaign, CampaignStatus } from './types';
import { createSeedCampaigns } from './mockData';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'nps_campaigns';

/**
 * Retrieves all campaigns from storage
 * Falls back to seed data if no stored campaigns exist
 */
export const getCampaigns = (): Campaign[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const seedCampaigns = createSeedCampaigns();
  
  if (stored) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const campaigns = JSON.parse(stored) as any[];
      const parsed = campaigns.map((c) => ({
        ...c,
        questionSourceType: c.questionSourceType || "manual",
        externalQuestionSourceUrl: c.externalQuestionSourceUrl || "",
        startDate: new Date(c.startDate),
        endDate: new Date(c.endDate),
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
        insights: {
          ...c.insights,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          npsOverTime: c.insights.npsOverTime.map((item: any) => ({
            ...item,
            date: new Date(item.date),
          })),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          detractorTickets: c.insights.detractorTickets.map((ticket: any) => ({
            ...ticket,
            createdAt: new Date(ticket.createdAt),
          })),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          detractorTasks: (c.insights.detractorTasks || []).map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
          })),
        },
      }));
      
      // Add any new seed campaigns that don't exist in stored data
      const newCampaigns = seedCampaigns.filter(seed => 
        !parsed.some(existing => existing.name === seed.name)
      );
      
      if (newCampaigns.length > 0) {
        const merged = [...parsed, ...newCampaigns];
        saveCampaigns(merged);
        return merged;
      }
      
      return parsed;
    } catch {
      return seedCampaigns;
    }
  }
  saveCampaigns(seedCampaigns);
  return seedCampaigns;
};

/**
 * Persists campaigns to storage
 */
export const saveCampaigns = (campaigns: Campaign[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
};

/**
 * Retrieves a single campaign by ID
 */
export const getCampaign = (id: string): Campaign | undefined => {
  const campaigns = getCampaigns();
  return campaigns.find(c => c.id === id);
};

/**
 * Creates a new campaign
 */
export const createCampaign = (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Campaign => {
  const campaigns = getCampaigns();
  const newCampaign: Campaign = {
    ...campaign,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  campaigns.push(newCampaign);
  saveCampaigns(campaigns);
  return newCampaign;
};

/**
 * Updates an existing campaign
 */
export const updateCampaign = (id: string, updates: Partial<Campaign>): Campaign | undefined => {
  const campaigns = getCampaigns();
  const index = campaigns.findIndex(c => c.id === id);
  if (index === -1) return undefined;
  
  campaigns[index] = {
    ...campaigns[index],
    ...updates,
    updatedAt: new Date(),
  };
  saveCampaigns(campaigns);
  return campaigns[index];
};

/**
 * Deletes a campaign by ID
 */
export const deleteCampaign = (id: string): boolean => {
  const campaigns = getCampaigns();
  const filtered = campaigns.filter(c => c.id !== id);
  if (filtered.length === campaigns.length) return false;
  saveCampaigns(filtered);
  return true;
};

// ============================================
// UI Helper Functions
// ============================================

/**
 * Returns the CSS class for a campaign status badge
 */
export const getStatusColor = (status: CampaignStatus): string => {
  switch (status) {
    case 'Active': return 'bg-green-500';
    case 'Paused': return 'bg-amber-500';
    case 'Draft': return 'bg-slate-400';
    case 'Completed': return 'bg-blue-500';
    default: return 'bg-slate-400';
  }
};

/**
 * Returns the CSS class for NPS score coloring
 */
export const getNPSColor = (score: number): string => {
  if (score >= 70) return 'text-[#E64A19]'; // Primary burnt orange
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
};
