# NPS Campaign Manager

## Overview

The NPS Campaign Manager is an enterprise-grade automotive CRM application designed to create, manage, and analyze Net Promoter Score (NPS) campaigns. The platform enables automotive businesses to collect customer feedback through multi-channel surveys (email, SMS, WhatsApp, AI-powered calls), track engagement metrics, and automate follow-up actions based on customer responses. The system focuses on measuring customer satisfaction across various touchpoints including new vehicle purchases, service visits, parts purchases, financing, and leasing interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type safety and developer experience
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Client-side routing using Wouter for lightweight navigation
- Single Page Application (SPA) architecture with client-side state management

**UI Component System**
- Radix UI primitives for accessible, unstyled components (dialogs, dropdowns, accordions, tabs, etc.)
- Shadcn/ui component library configured in "new-york" style
- Tailwind CSS for utility-first styling with custom design tokens
- Material Design principles adapted for automotive CRM workflows
- Design system emphasizes clarity and efficiency for data-heavy enterprise use

**State Management**
- TanStack Query (React Query) for server state management, caching, and API interactions
- Local storage-based campaign store (`client/src/lib/campaignStore.ts`) for demo/development purposes
- Custom hooks for toast notifications and mobile responsiveness

**Form Handling & Validation**
- React Hook Form with Hookform Resolvers for form state management
- Zod schemas for runtime validation
- Drag-and-drop functionality via @dnd-kit for reorderable lists (survey questions, follow-up steps)

**Data Visualization**
- Recharts library for NPS trend charts, donut charts, and distribution visualizations
- Custom chart components for campaign insights and analytics

### Backend Architecture

**Runtime & Server**
- Node.js with Express.js framework
- TypeScript throughout for type consistency
- HTTP server created via Node's `http` module
- Development mode uses Vite middleware for HMR integration

**API Design**
- RESTful API architecture (routes defined in `server/routes.ts`)
- All application routes prefixed with `/api`
- Static file serving for production builds via Express static middleware
- SPA fallback routing to `index.html` for client-side navigation

**Storage Interface**
- Abstracted storage layer via `IStorage` interface in `server/storage.ts`
- In-memory storage implementation (`MemStorage`) for development/demo
- Designed for easy migration to database-backed storage
- CRUD operations for campaigns, users, and related entities

### Data Storage

**Database Configuration**
- PostgreSQL as the target production database
- Drizzle ORM for type-safe database queries and migrations
- Neon serverless PostgreSQL driver (`@neondatabase/serverless`) for cloud deployment
- Schema definitions in `shared/schema.ts` using Drizzle's schema builder

**Schema Design**
- User authentication schema with username/password fields
- Campaign data model includes: basic info, survey questions, follow-up steps, message templates, review channels, outcome rules, AI agent settings, and insights
- Shared schema between client and server for type consistency

**Session Management**
- Express-session for session handling
- Connect-pg-simple for PostgreSQL-backed session storage
- Memorystore as fallback for development without database

### Authentication & Authorization

**Strategy**
- Passport.js with local strategy for username/password authentication
- Express sessions for maintaining user login state
- Cookie-based session management with credentials included in API requests

**Security Considerations**
- Password hashing (implementation expected via bcrypt or similar)
- CSRF protection via session configuration
- Environment-based secret management for session keys and database credentials

### External Dependencies

**Third-Party Services & APIs**
- **AI Integration**: OpenAI API and Google Generative AI for AI-powered customer follow-ups and conversation handling
- **Email Service**: Nodemailer for email notifications and campaign delivery
- **Payment Processing**: Stripe integration for potential subscription or payment features
- **File Processing**: XLSX library for importing/exporting campaign data and customer lists
- **WebSocket Support**: WS library for real-time updates (potential use for live dashboard updates)

**Database & Infrastructure**
- Neon serverless PostgreSQL for cloud-hosted database
- Environment variable configuration via `DATABASE_URL`
- Drizzle Kit for database migrations and schema management

**Development Tools**
- Replit-specific plugins for development experience (@replit/vite-plugin-runtime-error-modal, cartographer, dev-banner)
- Express Rate Limit for API throttling and abuse prevention
- CORS middleware for cross-origin resource sharing

**Styling & Design**
- Tailwind CSS with custom configuration for design tokens
- PostCSS with Autoprefixer for CSS processing
- Custom fonts: DM Sans, Architects Daughter, Fira Code, Geist Mono
- Color system based on neutral slate palette with primary blue (#2563eb)

**Build & Deployment**
- ESBuild for server-side bundling with selective dependency bundling
- Vite for client-side bundling and optimization
- Production builds output to `dist/` directory with client assets in `dist/public`
- Server bundled as CommonJS (`dist/index.cjs`) for Node.js execution