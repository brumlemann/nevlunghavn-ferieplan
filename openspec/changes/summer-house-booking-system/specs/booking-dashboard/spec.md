## ADDED Requirements

### Requirement: Season calendar view
The system SHALL display a calendar view showing the full vacation season with quota allocations and bookings.

#### Scenario: View season overview
- **WHEN** any authenticated user navigates to the dashboard
- **THEN** the system SHALL display a calendar for the current season showing quota periods color-coded by Quota Owner, confirmed bookings, and unallocated dates

#### Scenario: Visual distinction of booking statuses
- **WHEN** the calendar displays bookings
- **THEN** confirmed bookings, pending requests, and available dates SHALL be visually distinguishable (e.g., different colors or patterns)

### Requirement: Filter and navigation
The system SHALL allow users to filter the calendar and navigate between seasons.

#### Scenario: Filter by Quota Owner
- **WHEN** a user selects a specific Quota Owner filter
- **THEN** the calendar SHALL highlight only that Quota Owner's periods and bookings

#### Scenario: Navigate between seasons
- **WHEN** a user selects a different season from the season selector
- **THEN** the calendar SHALL display that season's quota allocations and bookings

### Requirement: Booking action from calendar
Users SHALL be able to initiate booking requests directly from the calendar view.

#### Scenario: Click to request booking
- **WHEN** a Regular User clicks on available dates within a Quota Owner's period on the calendar
- **THEN** the system SHALL open a booking request form pre-filled with the selected dates and the owning Quota Owner

#### Scenario: Quota Owner clicks own period
- **WHEN** a Quota Owner clicks on dates within their own period
- **THEN** the system SHALL open a booking form for direct self-booking

### Requirement: My bookings view
Each user SHALL have a personal view listing their own bookings and requests.

#### Scenario: View own bookings
- **WHEN** a user navigates to "My Bookings"
- **THEN** the system SHALL display all their booking requests and confirmed bookings, grouped by status (pending, confirmed, past)

### Requirement: Quota Owner pending requests view
A Quota Owner SHALL have a dedicated view showing all pending booking requests for their periods.

#### Scenario: View pending requests
- **WHEN** a Quota Owner navigates to their pending requests view
- **THEN** the system SHALL list all pending booking requests within their quota periods, with requester name, dates, and approve/decline actions
