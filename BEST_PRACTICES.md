# Best Practices & Architecture Guidelines

This document outlines the architecture patterns and best practices used in this project. These can serve as general rules for similar React/TypeScript projects.

---

## 1. Data Layer Isolation

### Rule: Separate mock/seed data from store operations

**Why:** Enables easy swapping between mock and real API data, clearer separation of concerns, and simpler testing.

```
src/lib/
├── mockData.ts      # Mock/seed data only (no logic)
├── campaignStore.ts # CRUD operations only (no data)
├── types.ts         # Type definitions
└── utils.ts         # Pure utility functions
```

**Pattern:**
```typescript
// mockData.ts - Data generation only
export const createSeedCampaigns = (): Campaign[] => { ... }

// campaignStore.ts - Operations only
import { createSeedCampaigns } from './mockData';
export const getCampaigns = (): Campaign[] => { ... }
```

---

## 2. Component Organization

### Rule: Group components by feature, not by type

```
src/components/
├── campaigns/          # Feature-specific components
│   ├── CampaignCard.tsx
│   ├── StatusBadge.tsx
│   └── NPSDonutChart.tsx
├── ui/                 # Reusable primitives (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   └── input.tsx
└── examples/           # Storybook-like examples (optional)
```

### Rule: Use consistent component exports
```typescript
// Named default export for feature components
export default function CampaignCard({ ... }: CampaignCardProps) { }

// Named exports for UI primitives
export { Button, buttonVariants } from './button'
```

---

## 3. Code Splitting & Lazy Loading

### Rule: Lazy load route-level pages

```typescript
// App.tsx
import { lazy, Suspense } from "react";

// Lazy load pages for code splitting
const CampaignList = lazy(() => import("@/pages/CampaignList"));
const CampaignDetail = lazy(() => import("@/pages/CampaignDetail"));

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/campaigns" component={CampaignList} />
        <Route path="/campaigns/:id" component={CampaignDetail} />
      </Switch>
    </Suspense>
  );
}
```

---

## 4. Build Optimizations (Vite)

### Rule: Configure manual chunks for vendor splitting

```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        // Core framework - rarely changes
        'vendor-react': ['react', 'react-dom'],
        
        // UI library - changes with design updates
        'vendor-radix': [
          '@radix-ui/react-dialog',
          '@radix-ui/react-select',
          // ... other radix components
        ],
        
        // Heavy libraries - load on demand
        'vendor-charts': ['recharts'],
        'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/sortable'],
        
        // Utilities - small, can be shared
        'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge'],
      },
    },
  },
},
```

**Benefits:**
- Better cache utilization (vendor chunks rarely change)
- Smaller initial bundle size
- Parallel loading of chunks

---

## 5. Path Aliases

### Rule: Use meaningful path aliases

```typescript
// vite.config.ts
resolve: {
  alias: {
    "@": path.resolve(import.meta.dirname, "client", "src"),
    "@shared": path.resolve(import.meta.dirname, "shared"),
    "@assets": path.resolve(import.meta.dirname, "attached_assets"),
  },
},
```

**Usage:**
```typescript
// Instead of: import { Button } from '../../../components/ui/button'
import { Button } from '@/components/ui/button';
import { Campaign } from '@/lib/types';
```

---

## 6. Type Safety

### Rule: Centralize type definitions

```typescript
// types.ts
export type CampaignStatus = "Active" | "Paused" | "Draft" | "Completed";
export type Language = "EN" | "DE" | "AR";

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  // ...
}

// Use const assertions for default values
export const DEFAULT_QUESTIONS: Record<ServiceType, SurveyQuestion[]> = {
  "New Vehicle Purchase": [ ... ],
} as const;
```

---

## 7. Netlify Deployment

### Rule: Include `netlify.toml` with proper configuration

```toml
[build]
  publish = "dist/public"
  command = "echo 'Skipping build - using pre-built files'"

[[headers]]
  for = "/*.js"
  [headers.values]
    Content-Type = "application/javascript; charset=utf-8"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Rule: Use relative paths for static hosting

```typescript
// vite.config.ts
export default defineConfig({
  base: './',  // Relative paths for any hosting
  // ...
});
```

### Rule: Commit build artifacts for zero-build deployment

```gitignore
# .gitignore
# dist/  # Commented out - commit pre-built files to avoid build minutes
```

**Workflow:**
1. `npm run build` locally
2. Commit `dist/` folder
3. Push to GitHub
4. Netlify deploys without building

---

## 8. State Management Pattern

### Rule: Use simple stores for client-only state

```typescript
// For demo/prototypes: localStorage-based store
const STORAGE_KEY = 'nps_campaigns';

export const getCampaigns = (): Campaign[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return createSeedCampaigns();
};
```

### Rule: Set up QueryClient for future API integration

```typescript
// queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});
```

---

## 9. UI Component Patterns

### Rule: Make components composable and configurable

```typescript
interface InsightsCardProps {
  title: string;
  icon?: React.ReactNode;       // Optional icon
  children: React.ReactNode;    // Composable content
  collapsible?: boolean;        // Feature flag
  defaultExpanded?: boolean;    // Configurable default
}

export default function InsightsCard({ 
  title, 
  icon, 
  children, 
  collapsible = false,          // Sensible defaults
  defaultExpanded = true 
}: InsightsCardProps) { ... }
```

### Rule: Use data-testid for testability

```tsx
<Card data-testid={`card-campaign-${campaign.id}`}>
<Button data-testid="button-create-campaign">
<Input data-testid="input-search" />
```

---

## 10. Project Structure Summary

```
project-root/
├── client/
│   ├── index.html
│   └── src/
│       ├── App.tsx           # Root component + routing
│       ├── main.tsx          # Entry point
│       ├── index.css         # Global styles
│       ├── components/
│       │   ├── campaigns/    # Feature components
│       │   └── ui/           # Reusable primitives
│       ├── hooks/            # Custom hooks
│       ├── lib/              # Utilities & stores
│       │   ├── types.ts      # Type definitions
│       │   ├── mockData.ts   # Sample/seed data
│       │   ├── campaignStore.ts # Data operations
│       │   ├── queryClient.ts   # React Query setup
│       │   └── utils.ts      # Pure utilities
│       └── pages/            # Route-level components
├── server/                   # Backend (optional)
├── shared/                   # Shared types/schema
├── dist/                     # Build output (committed)
├── netlify.toml              # Deployment config
├── vite.config.ts            # Build config
├── tailwind.config.ts        # Styling config
├── tsconfig.json             # TypeScript config
└── package.json
```

---

## Quick Reference Checklist

- [ ] Mock data isolated in `mockData.ts`
- [ ] Store operations in separate `store.ts` files
- [ ] Types centralized in `types.ts`
- [ ] Pages lazy-loaded with React.lazy()
- [ ] Vendor chunks configured in vite.config.ts
- [ ] Path aliases set up (@/ prefix)
- [ ] `netlify.toml` with SPA redirects
- [ ] `base: './'` in vite.config.ts
- [ ] `dist/` committed (not ignored)
- [ ] Components have data-testid attributes
- [ ] Feature components grouped by domain
