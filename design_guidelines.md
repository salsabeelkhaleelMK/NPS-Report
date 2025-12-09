# NPS CAMPAIGN MANAGER - DESIGN GUIDELINES

## Design Approach
**System-Based Approach**: This is a data-heavy, productivity-focused enterprise application. Using Material Design principles adapted for automotive CRM workflows with emphasis on clarity, efficiency, and actionable insights.

## Core Design Elements

### Color System
**Primary Blue**: `#2563eb` - All interactive elements, CTAs, primary actions
**Neutrals**: 
- Slate-50: Page backgrounds
- Slate-100: Hover states
- Slate-300: Disabled states
- Slate-400: Tertiary text
- Slate-600: Secondary text
- Slate-900: Primary text, selected tab backgrounds, action buttons

**Status Colors**:
- Green: Active campaigns
- Amber: Paused campaigns
- Gray: Draft campaigns
- Blue: Completed campaigns

### Typography Hierarchy
- **24px / 600**: Page titles ("Campaigns", "Campaign Detail")
- **18px / 600**: Section headers (Wizard steps, Dashboard sections)
- **16px / 500**: Subsection headers, Tab labels
- **14px / 400**: Body text, form labels, card content
- **12px / 400**: Captions, metadata, timestamps

### Layout System
**Spacing Units**: Tailwind's 8px base scale
- 24px (`p-6`): Between major sections
- 16px (`p-4`): Within cards, between form groups
- 8px (`p-2`): Within tight groupings, between labels and inputs
- 4px (`p-1`): Minimal spacing for inline elements

**Container Strategy**:
- Campaign List: Max-width container (`max-w-7xl`)
- Create Wizard: **Full-width** - no max-width constraint
- Detail Page: Full-width with internal section constraints
- Settings Drawer: Fixed 448px max-width

**Card Design**: Elevated cards with subtle shadows, rounded corners, white backgrounds. Progressive disclosure - show name/status/NPS primarily, reveal more on hover.

### Component Library

**Navigation**:
- No sidebar navigation
- Header with back buttons on detail/settings pages
- Breadcrumb-free navigation (simple back arrows)

**Tabs** (Critical Specification):
- **NO rounded corners** - sharp edges
- Selected state: Black background (`bg-slate-900`) + white text
- Unselected: Default gray with hover states
- Bottom border indicator on selected tab

**Buttons**:
- Primary actions: Black background (`bg-slate-900`)
- Buttons over images: Blurred backgrounds
- Form inputs: White backgrounds (`bg-white`)
- All buttons full-width in their containers when in forms

**Cards vs Tables**:
- **Always use cards** for campaign lists, never tables
- Cards show essential info prominently
- Hover reveals navigation arrow
- Click navigates to detail or opens settings

**Forms**:
- All inputs white background
- Labels above inputs (14px)
- Consistent spacing between form groups
- Validation states with color-coded feedback

**Accordions**:
- Default state: **All sections collapsed** in settings
- Clear expand/collapse indicators
- Smooth transitions

**Data Visualization**:
- Large NPS donut chart with color-coded segments (Promoters/Passives/Detractors)
- Horizontal distribution bars for percentages
- Line charts for trends over time
- Collapsible insight sections

**Drag & Drop**:
- Clear drag handles (6-dot icon pattern)
- Visual feedback during drag (elevated shadow, slight opacity)
- Drop zones highlighted
- Smooth reordering animations

### Wizard Design (5-Step Create Flow)
- Numbered step indicator with connecting lines
- Step titles below numbered icons
- Full-width form fields within each step
- Bottom navigation (Back/Next/Launch buttons)
- Progress saved to localStorage on each step
- Validation before advancing

### Settings Drawer
- Slide in from right
- Overlay backdrop
- Three tabs: Basics, Outcomes, AI Agent
- Accordion sections within Basics and Outcomes tabs
- Close button top-right
- Save/Cancel actions at bottom

### Empty States
- Centered content with icon
- Clear call-to-action ("Create your first campaign")
- Friendly, encouraging copy

### Progressive Disclosure
- Campaign cards: Show name/status/NPS → reveal details on hover
- Dashboard sections: Collapsible for Review Performance, AI Insights, Detractor Cases
- Settings: Accordion sections start collapsed

## Images
**No hero images required** - This is a dashboard/productivity application focused on data and workflows, not marketing content. Use icons, charts, and data visualizations instead.

## Page-Specific Guidelines

**Campaigns List**: Grid of cards, search bar at top, "Create New Campaign" button (black, prominent)

**Create Wizard**: Clean, spacious steps with generous whitespace. Full-width to accommodate complex form configurations.

**Campaign Detail**: Single scrollable page, sections clearly separated with consistent spacing. Donut chart as visual anchor.

**Settings Drawer**: Compact but not cramped, clear tab divisions, accordion for organization.