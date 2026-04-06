## Context

This is a greenfield project for the Nevlunghavn summer house. There is no existing booking system — coordination currently happens informally. The family has multiple branches, each represented by a designated Quota Owner who manages their branch's allotted time at the house. All family members have Google accounts, making Google OAuth the natural authentication choice and opening the door to Google Calendar integration.

The system needs to be simple enough for non-technical family members while enforcing fair quota allocation and transparent booking visibility.

## Goals / Non-Goals

**Goals:**
- Provide a single source of truth for summer house availability and bookings
- Authenticate users via Google accounts with minimal friction
- Enforce a role-based model: Administrator, Quota Owner, Regular User
- Allow Quota Owners to manage their allotted periods and approve/decline requests
- Allow Regular Users to request bookings in any Quota Owner's periods
- Sync confirmed bookings to Google Calendar
- Present a clear calendar dashboard showing the full season

**Non-Goals:**
- Payment or billing between family members
- Multi-property support (this is for one summer house only)
- Mobile-native app (responsive web is sufficient)
- Real-time collaboration / chat features
- Automated conflict resolution (Quota Owners decide manually)

## Decisions

### 1. Web Framework: Next.js (App Router)

**Choice:** Next.js with React and TypeScript for both frontend and API routes.

**Rationale:** Next.js provides server-side rendering, API routes, and a mature ecosystem in a single framework. It simplifies deployment (e.g., Vercel) and keeps the stack unified. TypeScript ensures type safety across the full stack.

**Alternatives considered:**
- Separate SPA + REST API (e.g., React + Express) — more operational complexity for a small family app
- SvelteKit — viable but smaller ecosystem; Next.js has broader community support

### 2. Database: PostgreSQL with Prisma ORM

**Choice:** PostgreSQL for persistence, Prisma as the ORM.

**Rationale:** PostgreSQL handles date-range queries well (important for quota periods and bookings). Prisma provides type-safe database access that integrates naturally with TypeScript. Schema migrations are straightforward.

**Alternatives considered:**
- SQLite — simpler but less capable with concurrent access and date-range operations
- Firebase/Firestore — vendor lock-in; relational model is a better fit for quota/booking relationships

### 3. Authentication: NextAuth.js with Google Provider

**Choice:** NextAuth.js (Auth.js) configured with the Google OAuth provider and Google Calendar API scopes.

**Rationale:** NextAuth.js is the standard auth library for Next.js. It handles OAuth flows, session management, and token refresh out of the box. Requesting Calendar API scopes during login enables calendar sync without a separate auth flow.

**Alternatives considered:**
- Custom OAuth implementation — unnecessary complexity
- Firebase Auth — adds an external dependency for something NextAuth handles natively

### 4. Google Calendar Integration: Server-side via Google Calendar API

**Choice:** The backend syncs bookings to Google Calendar using stored OAuth tokens and the Google Calendar API.

**Rationale:** Server-side sync ensures calendar events are created reliably when bookings are confirmed, regardless of whether the user is online. It also allows the system to update or remove events if bookings change.

**Alternatives considered:**
- Client-side Calendar API calls — unreliable; depends on user being online
- iCal feed — read-only and doesn't support per-user calendar entries

### 5. Deployment: Vercel + Managed PostgreSQL

**Choice:** Deploy on Vercel (free tier suitable for family-scale traffic). PostgreSQL hosted on a managed service (e.g., Neon, Supabase, or Railway).

**Rationale:** Vercel provides zero-config deployment for Next.js with edge functions, preview deployments, and automatic HTTPS. Managed PostgreSQL eliminates database administration overhead.

**Alternatives considered:**
- Self-hosted on a VPS — more maintenance burden for a low-traffic family app
- Serverless database (PlanetScale) — MySQL-based; PostgreSQL preferred for date-range queries

### 6. Calendar UI: react-big-calendar or similar

**Choice:** Use an established React calendar component for the booking dashboard.

**Rationale:** A calendar view is the core UI for seeing availability and bookings. An off-the-shelf component avoids reinventing complex date rendering and interaction logic.

## Risks / Trade-offs

- **Google API quotas** → The Calendar API has usage limits, but family-scale usage (tens of users) is well within free tier limits. Monitor usage if the family grows.
- **Token expiry** → OAuth refresh tokens can expire if Google revokes them or the user changes their Google password. Mitigation: detect expired tokens gracefully and prompt re-authentication.
- **Quota fairness disputes** → The system enforces structure but cannot resolve interpersonal disagreements. Mitigation: Administrator role can override allocations if needed; the system provides transparency via the dashboard.
- **Single point of failure** → If Vercel or the database provider has downtime, the system is unavailable. Mitigation: acceptable risk for a family app; data is backed up via Prisma migrations and can be redeployed elsewhere.
- **Scope creep** → Calendar sync adds OAuth complexity. Mitigation: implement booking management first, add calendar sync as a follow-up capability.

## Open Questions

- Should the system support recurring annual quota templates, or should Administrators set up quotas fresh each season?
- What granularity for bookings — full days only, or allow half-day check-in/check-out times?
- Should Quota Owners be able to delegate approval rights to another user in their branch?
