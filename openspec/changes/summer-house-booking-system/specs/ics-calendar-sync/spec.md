## ADDED Requirements

### Requirement: ICS feed generation
The system SHALL generate ICS calendar feeds for subscribing in any calendar app.

#### Scenario: Per-user per-property feed
- **WHEN** a user requests their personal ICS feed for a property
- **THEN** the system SHALL return an ICS feed containing that user's bookings on the property

#### Scenario: Property-wide feed
- **WHEN** a user requests the property-wide ICS feed
- **THEN** the system SHALL return an ICS feed containing all bookings on the property

#### Scenario: Dynamic generation
- **WHEN** an ICS feed URL is requested
- **THEN** the system SHALL generate the feed dynamically from current booking state — no file storage

### Requirement: Feed URL security
Feed URLs SHALL be unguessable and not require authentication.

#### Scenario: Random token in URL
- **WHEN** a feed URL is generated
- **THEN** it SHALL contain a cryptographically random token; the URL SHALL NOT be based on or derivable from user IDs, emails, or other guessable identifiers

### Requirement: Feed content
The ICS feed SHALL include approved bookings and pending requests.

#### Scenario: Approved booking event name
- **WHEN** an approved booking appears in the feed
- **THEN** the calendar event name SHALL be the property name and user name (e.g., "Nevlunghavn - Per")

#### Scenario: Pending request event name
- **WHEN** a pending request appears in the feed
- **THEN** the calendar event name SHALL include the pending state, property name, and user name (e.g., "[Pending] Nevlunghavn - Per")

#### Scenario: Hidden bookings
- **WHEN** a booking is in `rejected` or `cancelled` state
- **THEN** it SHALL NOT appear in the feed

### Requirement: Feed subscription prompts
The system SHALL offer ICS feed subscription at key moments.

#### Scenario: After property creation
- **WHEN** a user completes property creation
- **THEN** the system SHALL offer the option to subscribe to the property's ICS feed

#### Scenario: After accepting invitation
- **WHEN** a user accepts a property invitation
- **THEN** the system SHALL offer the option to subscribe to the property's ICS feed

#### Scenario: From property info
- **WHEN** a user views property info
- **THEN** the ICS feed URLs SHALL be accessible

### Requirement: One-way sync
The app is the single source of truth; calendar sync is one-way (app to calendar).

#### Scenario: Booking changes reflected
- **WHEN** a booking is approved, cancelled, or a new request is made
- **THEN** the change SHALL be reflected in the feed on the next request by the calendar app

#### Scenario: No push updates
- **WHEN** booking state changes
- **THEN** the system SHALL NOT push updates to calendar apps; calendar apps poll at their own frequency
