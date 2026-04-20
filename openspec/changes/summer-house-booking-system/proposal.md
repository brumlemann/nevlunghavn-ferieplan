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
- Default booking mode is whole-property; room-level granularity is optional and enabled per property
- Day-level booking resolution: each day in a request is independently auto-confirmed, routed to the quota holder, or routed to the existing booking holder for approval
- Approval-based overlap replaces the transition-day concept: any overlap triggers an approval flow with a message from the requester
- Cascading cancellation: when a booking is cancelled, pending requests for those days are deleted with notification to each requester
- Sync bookings to users' calendars via ICS feeds (subscribe in any calendar app)
- Notify users of booking requests, approvals, and cancellations via email (Resend) and in-app notification badge

## Capabilities

### New Capabilities
- `auth`: Multi-provider authentication (Google, Apple, email magic links) via Auth.js, with session management
- `property-management`: User-creatable properties with name, description, and configuration; multi-property membership with independent roles per property
- `role-management`: Two-tier property-scoped role system (Admin, Member) with role assignment and permissions
- `quota-allocation`: Seasonal quota periods assigned to Members representing family branches; quota is a data attribute, not a role
- `booking-requests`: Members request bookings by date range; day-level resolution routes each day to the appropriate approver (auto, quota holder, or existing booker); partial bookings supported
- `approval-flow`: Approval routing per day-claim with message attachment from requester; existing booker approves overlapping requests; cascading cancellation with requester notification
- `room-management`: Optional per-property feature; admin configures room names, bed types, and capacity; when enabled, bookings are per room per day
- `ics-calendar-sync`: Dynamically generated ICS feed URLs per user per property and per property-wide; users subscribe in any calendar app
- `notifications`: Email notifications via Resend for booking events; in-app notification badge for pending approvals
- `booking-dashboard`: Overview of the season calendar showing quota allocations, bookings, and availability

### Modified Capabilities

None — this is a greenfield project.

## Impact

- New web application (frontend + backend) to be built from scratch
- No Google Cloud project required — ICS feeds replace the Google Calendar API; Auth.js handles OAuth without calendar scopes
- Resend account required for transactional email delivery
- Neon PostgreSQL project required for persistent storage
- Vercel project required for deployment
- Persistent storage needed for: users, properties, memberships (with roles), quota periods, bookings, day-claims, rooms (optional), and notification records
- No existing systems are affected — this is a greenfield project
