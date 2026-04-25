## Why

The family needs a shared system to coordinate use of the Nevlunghavn summer house. Currently there is no structured way to manage who uses the house when, leading to conflicts and unclear availability. A web-based booking platform will give each family branch fair quota management while allowing flexibility for others to request available periods.

The system is designed from the start as a platform — **Hyttekabalen** — where users can create and configure their own properties (cabins, summer houses, etc.). Nevlunghavn is the first property on the platform, not a hardcoded singleton. This allows the same system to serve other family properties or friends without requiring a separate deployment.

## What Changes

- Introduce **Hyttekabalen**, a web application for managing shared property bookings
- Properties are user-creatable entities; Nevlunghavn is the first property on the platform
- Authenticate users via multiple providers: Google (primary), Apple, and email magic links
- Implement a two-tier, property-scoped role model: **Admin** and **Member**
- Admins configure property settings, manage rooms, invite members, and allocate quota periods
- Members view the calendar and make booking requests; members with quota allocated approve/decline requests within their quota periods
- Default booking mode is whole-property for v1; room-level granularity is a v2 feature (data model accommodates it from day one)
- Properties have an unowned-day approval setting: auto-approve (default) or require admin approval for days with no quota and no existing booking
- Booking requests are split at submission into separate bookings per approval boundary — each booking has exactly one approver or is auto-approved; no multi-approver bookings
- Approval-based overlap replaces the transition-day concept: any overlap triggers an approval flow with a message from the requester
- Cascading cancellation: when a booking is cancelled, pending requests for those days are deleted with notification to each requester
- Sync bookings to users' calendars via ICS feeds (subscribe in any calendar app)
- Notify users of booking requests, approvals, and cancellations via email (Resend) and in-app notification badge

## Capabilities

### New Capabilities
- `auth`: Multi-provider authentication (Google, Apple, email magic links) via Auth.js, with session management; email is a hard requirement for all users
- `properties`: User-creatable properties with progressive-disclosure creation flow (name, rooms, approval mode, invitations); property-scoped roles (Admin, Member); property info, editing, and soft deletion; invitation system via Resend
- `quotas-and-bookings`: Manual quota allocation by admins; booking requests split at submission per approval boundary; single-approver routing (auto, quota holder, existing booker, or admin); approval-based overlap; cascading cancellation; booking overview with quota and booking visibility
- `notifications`: Dual-channel notifications (email via Resend + in-app badge with count); notification screen for viewing and acting on notifications; deep links from email
- `ics-calendar-sync`: Dynamically generated ICS feed URLs with cryptographically random tokens; per-user-per-property and property-wide feeds; approved bookings and pending requests in feed; subscription prompts at key moments

### Modified Capabilities

None — this is a greenfield project.

## Impact

- New web application (frontend + backend) to be built from scratch
- No Google Cloud project required — ICS feeds replace the Google Calendar API; Auth.js handles OAuth without calendar scopes
- Resend account required for transactional email delivery
- Neon PostgreSQL project required for persistent storage
- Vercel project required for deployment
- Persistent storage needed for: users, properties, memberships (with roles), quota periods, bookings, day-claims, rooms (schema present in v1, feature active in v2), and notification records
- No existing systems are affected — this is a greenfield project
