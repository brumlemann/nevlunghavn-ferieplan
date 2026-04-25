## ADDED Requirements

### Requirement: Quota allocation
Admins SHALL be able to allocate quota periods to any member who has accepted a property invitation.

#### Scenario: Allocate quota
- **WHEN** an admin assigns a quota period (date range) to a member
- **THEN** the system SHALL create the quota and notify the member

#### Scenario: Multiple non-contiguous quotas
- **WHEN** an admin allocates multiple quota periods to the same member
- **THEN** the system SHALL allow non-contiguous date ranges on the same property

#### Scenario: No overlapping quotas
- **WHEN** an admin attempts to allocate a quota period that overlaps with an existing quota on the same property
- **THEN** the system SHALL prevent the allocation

#### Scenario: Quota change notification
- **WHEN** a quota period is changed or removed
- **THEN** the system SHALL notify the affected member

### Requirement: Quota visibility
Quota periods SHALL be visible in the booking overview.

#### Scenario: Quota display
- **WHEN** a member views the booking overview
- **THEN** the system SHALL display all quota period ranges with a clear indication of who the quota holder is

### Requirement: Manual quota setup
There SHALL be no recurring or template-based quota allocation. Admins set up quotas manually per season.

### Requirement: Booking requests
Any member SHALL be able to request a booking by selecting a date range on a property.

#### Scenario: Submit booking request
- **WHEN** a member selects a date range and submits a booking request
- **THEN** the system SHALL split the request into separate bookings based on approval boundaries, where each booking maps to a contiguous range of days with the same approver or auto-approval rule

#### Scenario: Attach message to request
- **WHEN** a member submits a booking request
- **THEN** the system SHALL allow the requester to attach a message (e.g., "Arriving at 3pm, ok if we overlap?")

### Requirement: Approval routing
Each booking created from a request SHALL have exactly one approver or be auto-approved.

#### Scenario: Unowned day with auto_approve setting
- **WHEN** a booking covers days with no quota and no existing booking, and the property's unowned-day approval mode is `auto_approve`
- **THEN** the booking SHALL be confirmed immediately

#### Scenario: Unowned day with admin_approval setting
- **WHEN** a booking covers days with no quota and no existing booking, and the property's unowned-day approval mode is `admin_approval`
- **THEN** the booking SHALL be routed to any property admin for approval

#### Scenario: Day within a quota period
- **WHEN** a booking covers days within a member's quota period
- **THEN** the booking SHALL be routed to the quota holder for approval

#### Scenario: Day with existing approved booking (overlap)
- **WHEN** a booking covers days that have an existing approved booking
- **THEN** the booking SHALL be routed to the existing booker for approval

#### Scenario: Approval authority transfer
- **WHEN** a booking is approved on days within a quota period
- **THEN** subsequent overlap requests for those days SHALL be routed to the approved booker, not the quota holder

### Requirement: Approval actions
Approvers SHALL be able to approve or reject booking requests.

#### Scenario: Approve from booking overview
- **WHEN** a quota holder, existing booker, or admin views a pending booking in the booking overview
- **THEN** they SHALL be able to approve or reject it directly

#### Scenario: Approve from notification screen
- **WHEN** an approver receives a booking request notification
- **THEN** they SHALL be able to approve or reject it from the notification screen

### Requirement: Booking states
A booking SHALL progress through defined states.

#### Scenario: State transitions
- **WHEN** a booking is created
- **THEN** it SHALL be in `requested` state, unless auto-approved, in which case it SHALL be in `approved` state

#### Scenario: Approval
- **WHEN** an approver approves a booking
- **THEN** it SHALL transition to `approved`

#### Scenario: Rejection
- **WHEN** an approver rejects a booking
- **THEN** it SHALL transition to `rejected` (final state, hidden from UI, persisted in DB)

#### Scenario: Cancellation
- **WHEN** a user cancels their own approved or requested booking
- **THEN** it SHALL transition to `cancelled` (final state, hidden from UI, persisted in DB)

### Requirement: No booking modification
Users SHALL NOT be able to shorten or extend a booking. To change dates, users cancel the booking and submit a new request.

### Requirement: Booking overview
The booking overview SHALL provide a clear view of the property's bookings and quotas.

#### Scenario: View bookings
- **WHEN** a member views the booking overview for a property
- **THEN** the system SHALL display all bookings for all members with their state (`approved`, `requested`)

#### Scenario: Booking segments
- **WHEN** bookings are displayed in the overview
- **THEN** each booking SHALL appear as its own visual segment, regardless of whether adjacent bookings belong to the same user

#### Scenario: Hidden bookings
- **WHEN** a booking is in `rejected` or `cancelled` state
- **THEN** it SHALL NOT be visible in the booking overview

#### Scenario: Booking overview is mobile-first
- **WHEN** the booking overview is rendered
- **THEN** it SHALL be designed mobile-first with a clear view of upcoming weeks/months

### Requirement: Cascading cancellation
When an approved booking is cancelled, pending requests routed to that booker SHALL be handled.

#### Scenario: Cancel with pending requests
- **WHEN** an approved booking is cancelled and there are pending requests routed to that booker for the same days
- **THEN** the system SHALL cancel those pending requests (transition to `cancelled` state), notify each affected requester, and revert day ownership to the quota holder (or unowned if no quota)

#### Scenario: No automatic re-routing
- **WHEN** pending requests are deleted due to cascading cancellation
- **THEN** the system SHALL NOT automatically re-route them; affected requesters can submit new requests
