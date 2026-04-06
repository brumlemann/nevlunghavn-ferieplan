## ADDED Requirements

### Requirement: Regular User can request a booking
A Regular User SHALL be able to submit a booking request for a date range within any Quota Owner's allotted period.

#### Scenario: Submit booking request
- **WHEN** a Regular User selects a date range within a Quota Owner's period and submits a booking request
- **THEN** the system SHALL create a booking request with status "pending" and notify the Quota Owner

#### Scenario: Request outside quota period
- **WHEN** a Regular User attempts to request dates that fall outside any Quota Owner's period or span multiple periods
- **THEN** the system SHALL reject the request and inform the user which periods the dates belong to

#### Scenario: Request overlapping existing confirmed booking
- **WHEN** a Regular User requests dates that overlap with an already confirmed booking
- **THEN** the system SHALL warn the user about the overlap but still allow the request to be submitted (the Quota Owner decides)

### Requirement: Quota Owner can request bookings in their own period
A Quota Owner SHALL be able to book dates directly within their own quota period without needing approval.

#### Scenario: Quota Owner self-books
- **WHEN** a Quota Owner selects dates within their own quota period
- **THEN** the system SHALL create a booking with status "confirmed" immediately

### Requirement: Quota Owner approves or declines requests
A Quota Owner SHALL be able to approve or decline booking requests for dates within their allotted periods.

#### Scenario: Approve a booking request
- **WHEN** a Quota Owner approves a pending booking request
- **THEN** the system SHALL change the booking status to "confirmed" and notify the requesting user

#### Scenario: Decline a booking request
- **WHEN** a Quota Owner declines a pending booking request
- **THEN** the system SHALL change the booking status to "declined" and notify the requesting user with the option to include a reason

#### Scenario: Pending request notification
- **WHEN** a new booking request is created for a Quota Owner's period
- **THEN** the system SHALL display a notification badge on the Quota Owner's dashboard and send an email notification

### Requirement: Cancel a booking
A user who made a booking request SHALL be able to cancel it. A Quota Owner SHALL be able to cancel any confirmed booking within their period. An Administrator SHALL be able to cancel any booking.

#### Scenario: User cancels own pending request
- **WHEN** a user cancels their own pending booking request
- **THEN** the system SHALL remove the request and notify the Quota Owner

#### Scenario: Quota Owner cancels confirmed booking in their period
- **WHEN** a Quota Owner cancels a confirmed booking within their quota period
- **THEN** the system SHALL change the booking status to "cancelled" and notify the booking holder

#### Scenario: Administrator cancels any booking
- **WHEN** an Administrator cancels any booking regardless of period ownership
- **THEN** the system SHALL change the booking status to "cancelled" and notify both the booking holder and the Quota Owner

### Requirement: Booking status lifecycle
A booking SHALL progress through defined statuses: pending, confirmed, declined, or cancelled.

#### Scenario: Status transitions
- **WHEN** a booking is in "pending" status
- **THEN** it SHALL only transition to "confirmed", "declined", or "cancelled"

#### Scenario: Terminal statuses
- **WHEN** a booking is in "confirmed", "declined", or "cancelled" status
- **THEN** only "confirmed" bookings SHALL be cancellable; "declined" and "cancelled" bookings SHALL be final
