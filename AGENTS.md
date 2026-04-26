<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

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

## i18n
- All user-facing strings go through next-intl, never hardcode text in components
- Messages live in messages/en.json, namespaced by feature (booking, property, auth)
- Default locale is en, Norwegian (nb) will be added later

## Data Fetching Pattern
- Server actions for all data access (no API routes, no fetch to /api)
- Server components call actions directly for initialData
- Client components use React Query (useQuery/useMutation) with server actions as queryFn
- Mutations invalidate relevant queries on success
- No useEffect + fetch, no raw useState for server data

## Domain Modeling (DDD-light)

Types and their domain-specific functions are co-located in the same file,
named after the domain concept. No classes — just TypeScript types with
pure functions. Domain files live in `src/domain/`.

### Conventions

- **One file per concept**: `booking.ts` owns `Booking`, `DayClaim`,
  and all functions that operate on them. `property.ts` owns `Property`,
  `Room`, and related functions.
- **Type guards for discriminated unions**: Use `is*` predicates
  (e.g. `isAutoConfirmed(claim)`, `isAdmin(membership)`) instead of casting.
- **Named functions, not methods**: Pure functions that take the domain
  type as the first argument — `bookingStatus(booking)`,
  `dayOwner(property, date)`.
- **Transformations belong to the output type**: `quotaToDayOwnership(quota)`
  lives in the file of the output type.
- **Throw on invariant violations**: Functions that receive data that must
  always be valid throw with a descriptive message rather than returning null.
- **Prefer discriminated unions over nullable fields**: When a concept has
  meaningfully different variants (e.g. notification types, approval routes),
  model each variant as a union member with only the fields it actually needs.
  Avoid `fieldX?: string` that only applies to some variants — use
  `| { kind: 'x'; fieldX: string }` instead.
- **Domain files are pure**: No database queries, no server action imports,
  no side effects. Server actions in `app/*/actions.ts` call domain functions
  for logic, then call the database for persistence.

### Rules

- **`app/` is thin**: Page files import a component, fetch initialData
  via a server action, and pass it as a prop. No business logic, no
  complex markup in page files.
- **Components don't call the database**: They receive data as props
  or fetch via React Query with a server action as queryFn.
  Components may import from `domain/` for types and pure functions.
- **Server actions live in `actions/`**, not inside `app/`. Split by
  domain concept (booking.ts, property.ts, etc.). Each file has
  'use server' at the top.
- **Dependency direction**: `app/` → `components/` + `actions/`,
  `actions/` → `domain/` + `db/`, `domain/` → nothing.
  Never import upward.

## Test Writing Guidelines

See `AGENTS_TESTING.md` for detailed guidelines on writing unit and E2E tests in this codebase. Unit tests are colocated with source files (`.test.ts` / `.test.tsx`).

## Styling
- Tailwind CSS utility classes, no component library
- Reusable UI primitives (Button, Input, Modal) live in components/ui/
- No inline styles, no CSS modules

## Design Tokens
All colors, fonts, and spacing from the Stitch design system must be
defined as Tailwind theme tokens in tailwind.config.ts. Never use raw
hex values, rgb, or arbitrary Tailwind values like bg-[#2D5A27] in
components.

### Colors (from Stitch design system)
- primary: #2D5A27 (forest green — primary actions, active nav)
- secondary: #E8F0E7 (light sage — backgrounds, secondary buttons)
- tertiary: #D4A373 (warm tan — accents, highlights)
- neutral: #757872 (grey — muted text, dividers)
- Map full shade scales from Stitch into primary-50 through primary-900 etc.

### Typography
- Headings: Plus Jakarta Sans
- Body: Plus Jakarta Sans
- Labels: Work Sans
- Define as fontFamily tokens in tailwind.config.ts

### Usage rules
- Reference tokens as bg-primary, text-tertiary, font-heading etc.
- If a color from the design doesn't exist as a token, add it to
  the config — don't use arbitrary values
- Agents must read tailwind.config.ts before creating any component
