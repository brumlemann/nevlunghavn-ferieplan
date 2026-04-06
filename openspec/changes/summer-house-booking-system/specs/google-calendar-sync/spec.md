## ADDED Requirements

### Requirement: Sync confirmed bookings to Google Calendar
The system SHALL create a Google Calendar event for each confirmed booking, visible on the calendars of both the booking holder and the Quota Owner.

#### Scenario: Booking confirmed creates calendar event
- **WHEN** a booking transitions to "confirmed" status
- **THEN** the system SHALL create a Google Calendar event on the booking holder's calendar with the booking dates, house name, and booking details

#### Scenario: Calendar event for Quota Owner
- **WHEN** a booking is confirmed within a Quota Owner's period
- **THEN** the system SHALL also create a corresponding calendar event on the Quota Owner's calendar

#### Scenario: Calendar event details
- **WHEN** a calendar event is created
- **THEN** it SHALL include the event title as "Nevlunghavn: [booker name]", the date range, and a link back to the booking in the application

### Requirement: Update calendar on booking changes
The system SHALL update or remove Google Calendar events when bookings change.

#### Scenario: Booking cancelled removes calendar event
- **WHEN** a confirmed booking is cancelled
- **THEN** the system SHALL delete the corresponding Google Calendar events from all affected users' calendars

#### Scenario: Graceful failure on calendar API error
- **WHEN** the Google Calendar API call fails (e.g., token expired, API unavailable)
- **THEN** the system SHALL still complete the booking status change, log the calendar sync failure, and retry the sync on the next relevant action or scheduled retry

### Requirement: Calendar sync is optional per user
A user SHALL be able to opt out of Google Calendar sync in their profile settings.

#### Scenario: User disables calendar sync
- **WHEN** a user disables calendar sync in their profile
- **THEN** the system SHALL not create or update Google Calendar events for that user's bookings

#### Scenario: User enables calendar sync
- **WHEN** a user enables calendar sync (default for new users)
- **THEN** the system SHALL resume creating calendar events for future bookings (existing bookings are not retroactively synced)
