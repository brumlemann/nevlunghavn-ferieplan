## Why

The family needs a shared system to coordinate use of the Nevlunghavn summer house. Currently there is no structured way to manage who uses the house when, leading to conflicts and unclear availability. A web-based booking system with role-based access will give each family branch fair quota management while allowing flexibility for others to request available periods.

## What Changes

- Introduce a web application for managing summer house bookings
- Authenticate users via their Google account (OAuth 2.0 / OpenID Connect)
- Implement three-tier role model: Administrator, Quota Owner, Regular User
- Administrators manage the system, users, and roles
- Quota Owners represent family branches and own designated time periods (quotas) within the vacation season
- Regular Users (typically descendants of a Quota Owner) can apply for bookings within any Quota Owner's allotted periods
- Quota Owners can approve or decline booking requests for their allotted periods
- Model the house's five named sleeping rooms with capacity details, enabling room-level bookings (partial or whole-house)
- Allow transition day overlap: when one booking ends and another begins on the same day, both are permitted so families can share a meal and say hello/goodbye
- Integrate with Google Calendar so bookings are reflected on users' calendars

## Capabilities

### New Capabilities
- `google-auth`: Google OAuth 2.0 authentication and session management
- `role-management`: Three-tier role system (Administrator, Quota Owner, Regular User) with role assignment and permissions
- `quota-allocation`: Seasonal quota periods assigned to Quota Owners representing family branches
- `booking-requests`: Regular Users can request bookings within any quota period; Quota Owners approve/decline; bookings specify rooms
- `room-management`: Five named sleeping rooms with bed configuration and capacity; room-level booking (partial or whole-house)
- `google-calendar-sync`: Sync confirmed bookings to Google Calendar for all involved parties
- `booking-dashboard`: Overview of the season calendar showing allocations, bookings, and availability

### Modified Capabilities

## Impact

- New web application (frontend + backend) to be built from scratch
- Google Cloud project required for OAuth credentials and Calendar API access
- Persistent storage needed for users, roles, quotas, bookings, and room definitions
- No existing systems are affected — this is a greenfield project
