## Context

This is a greenfield project to build **Hyttekabalen** — a platform for coordinating use of shared cabins and summer houses. The Nevlunghavn house is the first property created on the platform, but the system is designed from the start to support multiple independent properties, each with their own members, roles, and booking rules.

Coordination at Nevlunghavn currently happens informally. The family has multiple branches, each represented by a designated member who manages their branch's allotted time. The system needs to be simple enough for non-technical family members while enforcing fair quota allocation and transparent booking visibility.

## Goals / Non-Goals

**Goals:**
- Provide a single source of truth for cabin availability and bookings, per property
- Support multiple properties — each independently configured, with separate members and roles
- Authenticate users via multiple providers (Google, Apple, email magic links) with minimal friction
- Enforce a property-scoped two-tier role model: Admin and Member
- Allow Members with quota to manage their allotted periods and approve booking requests
- Allow all Members to request bookings within any period
- Support whole-property booking (room-level granularity is a v2 feature — see decision 9)
- Sync bookings to users' calendars via ICS feeds
- Notify users of booking requests, approvals, and cancellations via email and in-app badges
- Present a clear calendar dashboard showing the full season

**Non-Goals:**
- Payment or billing between family members
- Mobile-native app (responsive web is sufficient)
- Real-time collaboration / chat features
- Automated conflict resolution (day owners decide manually)
- Push notifications or SMS (email + in-app badge is sufficient for v1)
- Room-level booking granularity (deferred to v2 — architecture accommodates it, see decision 9)

## Decisions

### 1. Web Framework: Next.js (App Router)

**Choice:** Next.js with React and TypeScript for both frontend and API routes.

**Rationale:** Next.js provides server-side rendering, API routes, and a mature ecosystem in a single framework. It simplifies deployment (Vercel) and keeps the stack unified. TypeScript ensures type safety across the full stack.

**Alternatives considered:**
- Separate SPA + REST API (e.g., React + Express) — more operational complexity for a small family app
- SvelteKit — viable but smaller ecosystem; Next.js has broader community support

### 2. Database: PostgreSQL on Neon with Prisma ORM

**Choice:** PostgreSQL hosted on [Neon](https://neon.tech) (managed, serverless, scale-to-zero), accessed via Prisma ORM.

**Rationale:** PostgreSQL handles date-range queries well (critical for quota periods and booking overlap detection). Neon's serverless model means no idle compute costs — ideal for low-traffic family usage with occasional bursts during booking season. Prisma provides type-safe database access that integrates naturally with TypeScript. Schema migrations are straightforward. Neon's free tier covers expected usage without cost.

**Alternatives considered:**
- SQLite — simpler but less capable with concurrent access and date-range operations; doesn't work well with serverless deployments
- Supabase — also PostgreSQL + managed, but heavier with more features than needed; Neon is more focused
- Firebase/Firestore — vendor lock-in; relational model is a better fit for quota/booking relationships
- PlanetScale — MySQL-based; PostgreSQL preferred for date-range queries

### 3. Authentication: Auth.js with Multiple Providers

**Choice:** Auth.js (formerly NextAuth.js) configured with multiple OAuth providers: Google (primary), Apple, and email magic links.

**Rationale:** Auth.js is the standard auth library for Next.js. It handles OAuth flows, session management, and token refresh out of the box. Supporting multiple providers removes the assumption that all family members have Google accounts — some may prefer Apple login or just an email address. Google is expected to be the most common provider for existing users, but it is not required.

Calendar scopes are **not** requested during login. Calendar sync is handled via ICS feeds (see decision 4), which requires no OAuth scopes.

**Alternatives considered:**
- Google-only login — excludes family members without Google accounts
- Custom OAuth implementation — unnecessary complexity
- Firebase Auth — adds an external dependency for something Auth.js handles natively

### 4. Calendar Sync: ICS Feeds

**Choice:** The app generates unique `.ics` feed URLs per user per property, plus a property-wide feed. Users subscribe to these URLs in any calendar app (Google Calendar, Apple Calendar, Outlook, etc.).

**Rationale:** ICS feeds are universally supported, require no OAuth scopes, and are simpler to implement than the Google Calendar API. The feed is generated dynamically from current booking state on each request — no file storage needed. Creates, updates, and cancellations are automatically reflected in subscribers' calendars on next poll (Google polls ~every 12–24 hours; Apple every few hours). The app is the single source of truth; sync is one-way push.

**Alternatives considered:**
- Google Calendar API (server-side sync) — requires OAuth scopes at login, creates Google-specific coupling, and only benefits Google Calendar users. Given the move to multi-provider auth, this no longer fits.
- Client-side Calendar API calls — unreliable; depends on user being online at the right moment

**Future enhancement (v2):** For users who authenticate with Google and grant calendar scopes, the app could use the Calendar API for instant sync rather than waiting for the next poll. This is out of scope for v1.

### 5. Deployment: Vercel + Neon

**Choice:** Deploy on Vercel (free tier, suitable for family-scale traffic). PostgreSQL on Neon free tier.

**Rationale:** Vercel provides zero-config deployment for Next.js with preview deployments and automatic HTTPS. Neon's free tier includes generous compute and storage for low-traffic usage. Both scale-to-zero, meaning no idle costs. Together they form a cost-free production stack for the expected usage pattern.

**Alternatives considered:**
- Self-hosted on a VPS — more maintenance burden for a low-traffic family app
- Supabase for both auth and database — heavier than needed; using Auth.js + Neon keeps concerns separated

### 6. Multi-Property Architecture

**Choice:** Property is a first-class, user-creatable entity. Every booking, quota, role, and room belongs to a property. A user can be a member of multiple properties with independent roles on each.

**Rationale:** Starting multi-property from day one avoids the painful migration from a singleton model later. The overhead at the data model level is modest — essentially adding a `property_id` foreign key to most entities. The UI can default to showing the user's primary property, keeping the experience simple for single-property users.

The Nevlunghavn house is the first property created on the platform. Its architect-named rooms (Fehn, Knutsen, Utzon, Arneberg, Korsmo) are initial seed data for that property — not part of the core schema.

**Alternatives considered:**
- Hardcoded single-property model — simpler initially but creates a ceiling that forces a costly rewrite if the platform is extended

### 7. Role Model: Two Property-Scoped Roles

**Choice:** Two roles per property — **Admin** and **Member**. Both are stored as property memberships with a role field.

| Role | Permissions |
|------|-------------|
| **Admin** | Edit property settings, manage rooms, invite/remove members, promote members to admin, allocate quota periods to any member |
| **Member** | View calendar, make booking requests. If quota is allocated to them, they approve/reject requests within their quota periods |

A user can be Admin on one property and Member on another. "Quota Owner" is not a separate role — it is a Member who has one or more quota periods allocated. Whether a member has quota is a data attribute, not a role distinction.

**Rationale:** The three-tier model (Administrator, Quota Owner, Regular User) added complexity without clarity. The meaningful distinction is between those who can manage the property (Admins) and those who use it (Members). The ability to approve bookings comes from having quota allocated, not from a distinct role tier.

**Alternatives considered:**
- Three-tier model (Administrator, Quota Owner, Regular User) — Quota Owner felt like an artificial role tier; quota is just a data relationship

### 8. Room Model: Whole-Property for v1, Room-Level in v2

**Choice:** v1 supports **whole-property booking only** — one confirmed booking per day per property. Room-level granularity is deferred to v2, but the data model is designed from the start to accommodate it without a breaking migration.

**Data model consideration:** The `Room` entity and its relationship to day-claims should be present in the schema from day one, even if v1 never writes to it. When room-level is added in v2, admins will configure room names, a short description (so members can tell them apart — creative names alone are not enough), bed type, capacity, and whether a toddler bed is available. Day-claims gain an optional `room_id` foreign key; a null `room_id` means a whole-property claim.

**Rationale:** Room-level bookings add meaningful UI and approval-flow complexity — members must select rooms, the calendar must display per-room availability, and overlap detection becomes per-room rather than per-property. This is out of scope for the MVP. However, knowing that v2 will add it means the database schema must be designed to allow it — retrofitting a room model onto an existing booking table is painful. Designing the schema with rooms from day one, but leaving the feature flag off, is the right trade-off.

The Nevlunghavn property would enable rooms in v2 with the five architect-named rooms (initial seed data, not part of the core schema):

| Room | Architect | Description | Beds | Toddler bed | Sleeps |
|------|-----------|-------------|------|-------------|--------|
| Fehn | Sverre Fehn | Corner room on the ground floor, two windows | Two separate singles | No | 2 |
| Knutsen | Knut Knutsen | Largest room, faces the garden | Double (conjoined) | Yes | 2 (+1) |
| Utzon | Jørn Utzon | Top floor, sloped ceiling, sea view | Double (conjoined) | Yes | 2 (+1) |
| Arneberg | Arnstein Arneberg | Quiet room at the back, ground floor | Double (conjoined) | No | 2 |
| Korsmo | Arne Korsmo | Small room next to the bathroom | Double (conjoined) | No | 2 |

**Alternatives considered:**
- Add room-level to v1 — higher complexity, delays launch; the whole-property model is sufficient for most bookings
- Ignore rooms entirely until v2 — risks a painful schema migration; better to reserve the shape now

### 9. Booking Model: Day-Level Claims

**Choice:** A booking represents a contiguous range of **day-claims** on a property (or room, if rooms are enabled). Day-claims within a booking are grouped for display purposes but resolved individually through the approval flow.

**How resolution works for a single booking request:**
- Day with no quota and no existing booking → **depends on property setting** (see below)
- Day within a member's quota period → **quota holder approves**
- Day with an existing confirmed booking → **first booker approves** (they own the day, having already received quota approval)

**Property setting: unowned-day approval mode**

Properties have a setting controlling what happens when a day has no quota and no existing booking:

| Mode | Behaviour |
|------|-----------|
| `auto_approve` (default) | Request for that day is confirmed immediately — no action required |
| `admin_approval` | Request is routed to any property admin for approval |

This setting only governs days that fall outside any quota period — quota holders always have full authority to approve or reject requests within their own quota, regardless of this setting. `auto_approve` is the right default for properties where unallocated time is open to anyone and the booking system is mainly for visibility. `admin_approval` suits properties where unallocated days are not generally available without explicit permission — for example, a cabin that is otherwise closed outside of quota periods.

A booking request for June 10–20 might yield:
- Days 10–14: auto-confirmed
- Days 15–17: pending approval from quota holder
- Days 18–20: pending approval from existing booking holder

If some segments are approved and others rejected, the requester receives a partial booking and can decide whether to keep it or cancel.

**Rationale:** Day-level resolution is more precise than treating a booking request as a single atomic unit. It avoids situations where an entire request is blocked because a single day has a conflict. It also naturally handles the multi-approver scenario where different days are owned by different people.

**Alternatives considered:**
- Atomic booking approval — simpler but less flexible; a single conflicting day blocks the whole request

### 10. Approval-Based Overlap (Replacing Transition Days)

**Choice:** Remove the transition-day concept. Any booking request that overlaps with an existing confirmed booking triggers an approval flow to the owner of that day. The requester attaches a message to the request (e.g., "Arriving at 3pm, ok if we overlap?").

**Rationale:** The transition-day mechanism was a special case for a common real-world pattern. Making it a general approval flow handles not just same-day transitions but any overlap duration — two families can explicitly agree to share the cabin for any period. The message field lets them coordinate naturally. This is strictly more general than the transition-day rule.

**Conflict rule:** A day has an overlap conflict when two requests both claim that day (or the same room on that day, if rooms are enabled) and neither has explicit approval from the day owner. The approval from the quota holder transfers to the first booker once their booking is confirmed; the quota holder does not re-approve subsequent requests for already-confirmed days.

**Alternatives considered:**
- Keep transition-day rule — handles the specific lunch/dinner overlap case but doesn't generalise to other durations or explicit negotiated overlaps

### 11. Cascading Cancellation

**Choice:** When a confirmed booking is cancelled:
1. All pending requests routed to that booker (i.e., requests for days they "owned") are deleted with a notification to each affected requester
2. Ownership of those days reverts to the quota holder (or becomes unowned if no quota)
3. Affected requesters can make new requests, which route to the new day owner

No automatic re-routing. Delete and notify is sufficient for a family app.

**Rationale:** Re-routing pending requests automatically would require resolving who owns the day post-cancellation, then potentially re-initiating multi-step approval chains. The complexity is not worth it at family scale — notifying affected requesters and letting them re-request is simpler and gives them agency.

**Alternatives considered:**
- Automatic re-routing — complex to implement correctly; doesn't account for the requester having changed their plans in the meantime

### 12. Notification System

**Choice:** Two notification channels for v1:
- **Email notifications** via [Resend](https://resend.com) for: new booking requests requiring approval, booking approvals/rejections, cancellations affecting pending requests
- **In-app notification badge** on the dashboard showing the count of pending actions (requests awaiting the user's approval)

**Rationale:** Resend provides a simple transactional email API with a generous free tier. Email is sufficient for a low-frequency family coordination app — users don't need real-time push notifications for booking requests. The in-app badge provides awareness of pending actions without requiring navigation to a dedicated notifications page.

**Alternatives considered:**
- No email, in-app only — users would miss booking requests if they don't check the app regularly
- Push notifications — unnecessary complexity for v1; email covers the async coordination need

## Risks / Trade-offs

- **Partial bookings** → The day-level model means a request can result in a partial booking where some days are confirmed and others are pending or rejected. The UI must communicate this clearly, and users need a way to decide whether a partial booking is acceptable before accepting it.
- **ICS poll latency** → Calendar apps poll ICS feeds infrequently (Google: ~12–24h). Changes will not appear instantly. Mitigation: set this expectation in the UI ("your calendar app will update within 24 hours"). This is acceptable for a family booking app, not a real-time scheduling tool.
- **Multi-approver coordination** → A single booking request may require approvals from multiple people (quota holder for some days, existing booker for others). This creates the possibility of partial approval states lasting for days. Mitigation: clear UI showing which days are pending which approval; requesters can cancel and re-request if partial state is not useful.
- **Quota fairness disputes** → The system enforces structure but cannot resolve interpersonal disagreements. Mitigation: Admin role can override allocations; the system provides transparency via the dashboard.
- **Single point of failure** → Vercel or Neon downtime makes the system unavailable. Mitigation: acceptable risk for a family app; data is backed up via Prisma migrations and can be redeployed elsewhere.
- **Multi-property scope creep** → The platform framing invites over-engineering. Mitigation: build the data model multi-property-aware from day one, but keep the UI focused on a single property per user session. Don't build a property marketplace.
- **Auth.js token management** → OAuth refresh tokens can expire if the provider revokes them. Mitigation: detect expired tokens and prompt re-authentication gracefully.

## Open Questions

- Should the system support recurring annual quota templates, or should Admins set up quotas fresh each season?
- Should Members be able to delegate approval rights to another member for a period they own (e.g., when on holiday without internet)?
- What is the UX when a requester's partial booking has some days approved and others still pending — should there be a deadline for the approval before the partial booking auto-expires?
