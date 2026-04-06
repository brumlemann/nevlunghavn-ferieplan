## 1. Project Setup

- [ ] 1.1 Initialize Next.js project with TypeScript and App Router (`npx create-next-app@latest`)
- [ ] 1.2 Install and configure Prisma ORM with PostgreSQL provider
- [ ] 1.3 Install NextAuth.js (Auth.js) and Google provider dependencies
- [ ] 1.4 Install UI dependencies (Tailwind CSS, react-big-calendar or similar calendar component)
- [ ] 1.5 Create initial Prisma schema with User, Role, Season, QuotaPeriod, Booking, BookingRoom, and Room models
- [ ] 1.6 Set up environment variables template (`.env.example`) for Google OAuth credentials, database URL, and NextAuth secret
- [ ] 1.7 Create database seed script to populate the five rooms (Fehn, Knutsen, Selmer, Arneberg, Backer) with bed configuration and capacity

## 2. Authentication (google-auth)

- [ ] 2.1 Configure NextAuth.js with Google OAuth provider including Calendar API scopes
- [ ] 2.2 Implement callback to store OAuth access and refresh tokens in the database
- [ ] 2.3 Implement sign-in page with "Sign in with Google" button
- [ ] 2.4 Implement auto-creation of User record on first sign-in with default Regular User role
- [ ] 2.5 Implement first-user bootstrap: assign Administrator role to the first user who signs in
- [ ] 2.6 Implement sign-out functionality and session invalidation
- [ ] 2.7 Add token refresh logic to obtain new access tokens using stored refresh tokens
- [ ] 2.8 Add middleware to protect routes requiring authentication

## 3. Role Management (role-management)

- [ ] 3.1 Create Administrator user management page listing all users with name, email, role, and status
- [ ] 3.2 Implement role assignment API endpoint (Administrator only)
- [ ] 3.3 Implement user deactivation/reactivation API endpoint (Administrator only)
- [ ] 3.4 Add role-based authorization middleware for API routes and pages
- [ ] 3.5 Add UI controls for role changes and user account management on the admin page

## 4. Room Management (room-management)

- [ ] 4.1 Create Room model in Prisma schema (name, architect, bedConfiguration, toddlerBed, adultCapacity, description)
- [ ] 4.2 Implement room information page displaying all five rooms with their details
- [ ] 4.3 Implement Administrator room edit API (update description/capacity only, no add/delete)
- [ ] 4.4 Build room picker UI component for use in booking forms (checkbox per room + "Whole house" toggle)

## 5. Quota Allocation (quota-allocation)

- [ ] 5.1 Create Season management page (Administrator only) for creating/editing seasons with start and end dates
- [ ] 5.2 Implement API for creating quota periods within a season assigned to Quota Owners
- [ ] 5.3 Add overlap validation to prevent overlapping quota periods within a season
- [ ] 5.4 Create Quota Owner overview page showing their assigned periods across seasons
- [ ] 5.5 Implement season template copy feature to pre-fill a new season from a previous one
- [ ] 5.6 Display unallocated dates within a season as visually distinct on the calendar

## 6. Booking Requests (booking-requests)

- [ ] 6.1 Implement booking request API: create a pending booking for a date range and selected rooms within a quota period
- [ ] 6.2 Add validation to reject requests that fall outside any quota period or span multiple periods
- [ ] 6.3 Implement room-level conflict detection: warn on overlapping room claims (but allow submission), permit transition day overlaps
- [ ] 6.4 Implement transition day logic: end_A == start_B on same room is allowed; multi-day same-room overlap is flagged
- [ ] 6.5 Implement Quota Owner self-booking with room selection: direct confirmation without approval flow
- [ ] 6.6 Implement approve/decline API for Quota Owners to act on pending requests in their periods
- [ ] 6.7 Implement booking cancellation API with role-based permissions, releasing claimed rooms on cancel
- [ ] 6.8 Implement booking status lifecycle enforcement (pending -> confirmed/declined/cancelled transitions)
- [ ] 6.9 Add email notifications for booking request, approval, decline, and cancellation events

## 7. Booking Dashboard (booking-dashboard)

- [ ] 7.1 Build season calendar component using react-big-calendar with color-coded quota periods by Quota Owner
- [ ] 7.2 Display confirmed bookings, pending requests, and available dates with distinct visual styles
- [ ] 7.3 Show room occupancy per day: which rooms are free, booked, or in transition
- [ ] 7.4 Build room availability grid view (rooms as rows, dates as columns) showing occupancy and transition days
- [ ] 7.5 Implement Quota Owner filter to highlight a specific owner's periods and bookings
- [ ] 7.6 Implement season selector to navigate between seasons
- [ ] 7.7 Add click-to-book interaction: open booking request form with room picker pre-showing available rooms
- [ ] 7.8 Build "My Bookings" page listing the user's own requests grouped by status, showing rooms claimed
- [ ] 7.9 Build Quota Owner pending requests view with rooms requested, approve/decline action buttons

## 8. Google Calendar Sync (google-calendar-sync)

- [ ] 8.1 Implement Google Calendar API client using stored OAuth tokens
- [ ] 8.2 Create calendar event on booking confirmation for the booking holder (include room names in event)
- [ ] 8.3 Create calendar event on booking confirmation for the Quota Owner
- [ ] 8.4 Delete calendar events when a confirmed booking is cancelled
- [ ] 8.5 Implement graceful error handling: complete booking changes even if Calendar API fails, log failures
- [ ] 8.6 Add per-user calendar sync opt-out toggle in profile settings
- [ ] 8.7 Skip calendar event creation for users who have disabled sync

## 9. Polish and Deploy

- [ ] 9.1 Add responsive design for mobile/tablet use
- [ ] 9.2 Add loading states, error boundaries, and user-friendly error messages
- [ ] 9.3 Write end-to-end tests for core flows (sign-in, booking with rooms, approve, transition day, calendar sync)
- [ ] 9.4 Configure Vercel deployment with environment variables
- [ ] 9.5 Set up managed PostgreSQL database and run Prisma migrations in production
