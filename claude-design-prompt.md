# Hyttekabalen — Design Exploration

## What is this?

Hyttekabalen is a web app for coordinating use of shared cabins and summer houses. Families create properties, invite members, allocate time quotas, and manage bookings. Think of it as a lightweight booking system for family-owned holiday homes.

The Nevlunghavn summer house is the first property — but the platform supports multiple properties per user.

## Design constraints

- **Mobile-first** — this is a family app used primarily on phones. It must work well on desktop too, but design for mobile first.
- **Simple for non-technical users** — grandparents, cousins, in-laws. Every interaction should be obvious.
- **Functional specs, not UX specs** — the requirements below describe WHAT the system must do, not HOW it should look. You have full creative freedom on layout, navigation, visual hierarchy, and interaction patterns. Explore different approaches.

## Tech context (for feasibility)

Next.js (App Router), React, TypeScript, Tailwind CSS, deployed on Vercel. This is a responsive web app, not a native app.

## Core user flow

Dashboard → select property → booking overview → make a request → approver gets notification → approve/reject

## Screens to explore

I'd like you to explore designs for the following screens. Start with the booking overview — it's the most important and hardest screen.

---

### 1. Booking overview (start here)

This is the main screen when you're inside a property. It needs to:

- Give a clear view of upcoming weeks/months
- Show quota period ranges with an indication of who the quota holder is
- Show all bookings for all members, with their state (approved, requested)
- Each booking appears as its own visual segment (not merged with adjacent bookings)
- Rejected and cancelled bookings are hidden
- Allow members to select a date range to make a booking request
- Allow quota holders and admins to approve/reject pending bookings directly from this view
- Include a notification indicator (unread count) and a way to navigate to property info

This is NOT necessarily a traditional calendar. Explore different approaches — timeline views, list views, week strips, whatever serves the mobile-first constraint best. The key is that it must make it easy to see "what's coming up" and "where can I book?"

### 2. User dashboard

- Shows all properties the user belongs to
- Empty state with create-property prompt for new users
- Notification indicator visible here too
- Entry point to create a new property

### 3. Property creation flow

Progressive disclosure — don't show everything at once:
1. Property name
2. Rooms: for each room, collect name, description, bed configuration (double beds, single beds, infant/toddler crib spaces)
3. Unowned-day approval mode (auto-approve vs require admin approval) — needs a clear explanation of what this means
4. Invite members (email + role selection)
5. ICS calendar feed subscription prompt

### 4. Notification screen

Central place for viewing and acting on notifications:
- Read/unread state
- Actionable notifications: accept/reject property invitations, approve/reject booking requests
- Informational notifications: booking approved/rejected, property deleted, quota allocated/changed/removed
- Deep-linked from email notifications

### 5. Property info screen

- Room list with names, descriptions, bed configuration
- Member list with roles
- Unowned-day approval mode setting (visible to all, editable by admins)
- Admin actions: edit property name, add/edit/remove rooms, add/remove members, change roles, invite new members
- Property deletion (type property name to confirm)
- ICS feed URLs accessible here

---

## Booking model (important for the booking overview design)

- A member selects a date range to request a booking
- The system splits the request into separate bookings based on who needs to approve each segment:
  - Days with no quota and no existing booking → auto-approved or routed to admin (property setting)
  - Days in someone's quota → routed to the quota holder
  - Days with an existing approved booking → routed to the existing booker (for overlap approval)
- Each booking has exactly ONE approver — no complex multi-approval states
- Booking states: requested → approved/rejected. Approved can be cancelled.
- Requesters can attach a message to their request (e.g., "Arriving at 3pm, ok to overlap?")
- To change dates, users cancel and re-request (no edit/shorten)

## Sample data for mockups

**Property:** Nevlunghavn (5 rooms: Fehn, Knutsen, Utzon, Arneberg, Korsmo)

**Members:**
- Kyrre (admin)
- Martin (member, quota holder for Jul 1–14)
- Kristoffer (member, quota holder for Jul 15–31)
- Torjus (member, no quota)
- Sunniva (member, no quota)

**Bookings:**
- Martin: Jul 3–10 (approved)
- Torjus: Jul 5–8 (requested, pending Martin's approval — overlap)
- Kristoffer: Jul 18–25 (approved)
- Sunniva: Jul 20–23 (requested, pending Kristoffer's approval — overlap)
- Kyrre: Aug 1–7 (approved, auto-approved, no quota period)

---

## Codebase context

The full spec files are attached in the codebase. Before starting, please read through these files for the detailed functional requirements:

- `openspec/changes/summer-house-booking-system/proposal.md` — big picture: what the system does and why
- `openspec/changes/summer-house-booking-system/specs/properties/spec.md` — dashboard, property creation, invitations, roles, property info, deletion
- `openspec/changes/summer-house-booking-system/specs/quotas-and-bookings/spec.md` — quota allocation, booking requests, approval routing, booking states, cascading cancellation, booking overview
- `openspec/changes/summer-house-booking-system/specs/notifications/spec.md` — notification types, dual-channel delivery, notification screen
