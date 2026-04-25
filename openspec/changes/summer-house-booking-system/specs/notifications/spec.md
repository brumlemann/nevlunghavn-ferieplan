## ADDED Requirements

### Requirement: Dual-channel notifications
The system SHALL notify users via both email and in-app notifications for every notification event. The two channels are not either/or — both SHALL fire.

### Requirement: In-app notification indicator
The system SHALL show a visual indicator of unread notifications with a count.

#### Scenario: Indicator visibility
- **WHEN** a user has unread notifications
- **THEN** the indicator SHALL be visible on both the user dashboard and the booking overview

#### Scenario: Navigate to notification screen
- **WHEN** a user activates the notification indicator
- **THEN** the system SHALL take the user to the notification screen

### Requirement: Email notifications
Email notifications SHALL be sent via Resend.

#### Scenario: Email content
- **WHEN** an email notification is sent
- **THEN** it SHALL contain a meaningful title, a short description of the notification, and a deep link to the notification screen

### Requirement: Notification screen
The notification screen SHALL be the central place for viewing and acting on notifications.

#### Scenario: View notifications
- **WHEN** a user navigates to the notification screen
- **THEN** the system SHALL display all notifications with read/unread state

#### Scenario: Actionable notifications
- **WHEN** a notification requires an action
- **THEN** the user SHALL be able to take that action from the notification screen

### Requirement: Notification types

#### Scenario: Property invitation
- **WHEN** a user is invited to a property
- **THEN** the system SHALL notify the invitee with an option to accept or reject (actionable from notification screen only)

#### Scenario: Invitation response
- **WHEN** an invitee accepts or rejects a property invitation
- **THEN** the system SHALL notify all admins of the property (informational)

#### Scenario: Property deleted
- **WHEN** a property is deleted
- **THEN** the system SHALL notify all members of the property (informational)

#### Scenario: Booking request
- **WHEN** a booking request requires approval
- **THEN** the system SHALL notify the approver — quota holder, existing booker, or admin depending on routing (actionable from both notification screen and booking overview)

#### Scenario: Booking approved
- **WHEN** a booking is approved
- **THEN** the system SHALL notify the requester (informational)

#### Scenario: Booking rejected
- **WHEN** a booking is rejected
- **THEN** the system SHALL notify the requester (informational)

#### Scenario: Booking cancelled (cascading)
- **WHEN** pending requests are cancelled due to a cascading cancellation
- **THEN** the system SHALL notify each affected requester (informational)

#### Scenario: Quota allocated
- **WHEN** a quota period is allocated to a member
- **THEN** the system SHALL notify the member (informational)

#### Scenario: Quota changed
- **WHEN** a quota period is modified
- **THEN** the system SHALL notify the affected member (informational)

#### Scenario: Quota removed
- **WHEN** a quota period is removed
- **THEN** the system SHALL notify the affected member (informational)

### Requirement: Notification state
Notifications SHALL track read/unread state.

#### Scenario: Actioned notifications
- **WHEN** a user takes action on an actionable notification (e.g., accepts an invitation)
- **THEN** the notification SHALL be marked as resolved

#### Scenario: No hard delete
- **WHEN** notifications are resolved or read
- **THEN** they SHALL NOT be hard deleted from the database
