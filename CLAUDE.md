@AGENTS.md

# Hyttekabalen — project context for Claude

## What this project is
A mobile-first web app for coordinating shared cabin/summer house bookings. Families create properties, invite members, allocate time quotas, and manage bookings. Nevlunghavn is the first property on the platform.

## Tech stack
- **Framework**: Next.js 16, App Router, TypeScript, Tailwind v4
- **Runtime / package manager**: Bun — use `bun` and `bunx`, never `npm` or `npx`
- **Database**: Neon Postgres (Vercel integration)
- **ORM**: Drizzle ORM with Neon HTTP driver — schema at `src/db/schema.ts`, client at `src/db/index.ts`
- **Auth**: Auth.js v5 (`next-auth@beta`) — Google, Apple, Resend magic links, Drizzle adapter
- **Email**: Resend — notifications, invitations, and magic links
- **Hosting**: Vercel (`kyrrelms-projects/hyttekabalen`)

## Specs
All functional requirements live in `openspec/changes/summer-house-booking-system/`:
- `proposal.md` — big picture and motivation
- `design.md` — architecture decisions and rationale
- `specs/auth/spec.md` — authentication
- `specs/properties/spec.md` — dashboard, property creation, roles, invitations
- `specs/quotas-and-bookings/spec.md` — quota allocation, booking requests, approval routing
- `specs/notifications/spec.md` — notification types, dual-channel delivery
- `specs/ics-calendar-sync/spec.md` — ICS feed

Read the relevant spec before implementing any feature. The spec describes WHAT, not HOW.

## Key conventions
- No hard deletes anywhere — all deletions result in a final soft-deleted state
- Drizzle migrations go in `drizzle/` — generate with `bun run db:generate`, apply with `bun run db:migrate`
- Mobile-first design — design for phones, enhance for desktop
