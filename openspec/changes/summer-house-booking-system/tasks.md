## 1. Project Setup

- [ ] 1.1 Initialize Next.js project with TypeScript and App Router (`npx create-next-app@latest`)
- [ ] 1.2 Install and configure Prisma ORM with PostgreSQL provider
- [ ] 1.3 Install NextAuth.js (Auth.js) and Google provider dependencies
- [ ] 1.4 Install UI dependencies (Tailwind CSS, react-big-calendar or similar calendar component)
- [ ] 1.5 Create initial Prisma schema with User, Role, Season, QuotaPeriod, and Booking models
- [ ] 1.6 Set up environment variables template (`.env.example`) for Google OAuth credentials, database URL, and NextAuth secret

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

## 4. Quota Allocation (quota-allocation)

- [ ] 4.1 Create Season management page (Administrator only) for creating/editing seasons with start and end dates
- [ ] 4.2 Implement API for creating quota periods within a season assigned to Quota Owners
- [ ] 4.3 Add overlap validation to prevent overlapping quota periods within a season
- [ ] 4.4 Create Quota Owner overview page showing their assigned periods across seasons
- [ ] 4.5 Implement season template copy feature to pre-fill a new season from a previous one
- [ ] 4.6 Display unallocated dates within a season as visually distinct on the calendar

## 5. Booking Requests (booking-requests)

- [ ] 5.1 Implement booking request API: create a pending booking for a date range within a quota period
- [ ] 5.2 Add validation to reject requests that fall outside any quota period or span multiple periods
- [ ] 5.3 Add overlap warning when requesting dates that conflict with an existing confirmed booking
- [ ] 5.4 Implement Quota Owner self-booking: direct confirmation without approval flow
- [ ] 5.5 Implement approve/decline API for Quota Owners to act on pending requests in their periods
- [ ] 5.6 Implement booking cancellation API with role-based permissions (user, Quota Owner, Administrator)
- [ ] 5.7 Implement booking status lifecycle enforcement (pending -> confirmed/declined/cancelled transitions)
- [ ] 5.8 Add email notifications for booking request, approval, decline, and cancellation events

## 6. Booking Dashboard (booking-dashboard)

- [ ] 6.1 Build season calendar component using react-big-calendar with color-coded quota periods by Quota Owner
- [ ] 6.2 Display confirmed bookings, pending requests, and available dates with distinct visual styles
- [ ] 6.3 Implement Quota Owner filter to highlight a specific owner's periods and bookings
- [ ] 6.4 Implement season selector to navigate between seasons
- [ ] 6.5 Add click-to-book interaction: open booking request form from calendar date selection
- [ ] 6.6 Build "My Bookings" page listing the user's own requests grouped by status
- [ ] 6.7 Build Quota Owner pending requests view with approve/decline action buttons

## 7. Google Calendar Sync (google-calendar-sync)

- [ ] 7.1 Implement Google Calendar API client using stored OAuth tokens
- [ ] 7.2 Create calendar event on booking confirmation for the booking holder
- [ ] 7.3 Create calendar event on booking confirmation for the Quota Owner
- [ ] 7.4 Delete calendar events when a confirmed booking is cancelled
- [ ] 7.5 Implement graceful error handling: complete booking changes even if Calendar API fails, log failures
- [ ] 7.6 Add per-user calendar sync opt-out toggle in profile settings
- [ ] 7.7 Skip calendar event creation for users who have disabled sync

## 8. Polish and Deploy

- [ ] 8.1 Add responsive design for mobile/tablet use
- [ ] 8.2 Add loading states, error boundaries, and user-friendly error messages
- [ ] 8.3 Write end-to-end tests for core flows (sign-in, booking request, approve, calendar sync)
- [ ] 8.4 Configure Vercel deployment with environment variables
- [ ] 8.5 Set up managed PostgreSQL database and run Prisma migrations in production
