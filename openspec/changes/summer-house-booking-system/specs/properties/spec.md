## ADDED Requirements

### Requirement: User dashboard
The system SHALL present a dashboard showing all properties the user is a member or admin of.

#### Scenario: User with properties
- **WHEN** an authenticated user navigates to the dashboard
- **THEN** the system SHALL display all properties they belong to

#### Scenario: User with no properties
- **WHEN** an authenticated user has no property memberships
- **THEN** the system SHALL display an empty state with a prompt to create a new property

#### Scenario: Create property from dashboard
- **WHEN** a user activates the create property action
- **THEN** the system SHALL initiate the property creation flow

### Requirement: Mobile-first design
The system SHALL be designed mobile-first, functioning well on larger screens as well. This applies to all screens and flows.

### Requirement: Property creation flow
The property creation flow SHALL use progressive disclosure to avoid overwhelming the user.

#### Scenario: Core property configuration
- **WHEN** a user initiates property creation
- **THEN** the system SHALL collect: property name, rooms (each with name, description, and bed configuration: number of double beds, single beds, and infant/toddler crib spaces), and the unowned-day approval mode (defaulting to `auto_approve`)

#### Scenario: Creator becomes admin
- **WHEN** property creation is completed
- **THEN** the creator SHALL automatically become an admin of the property

#### Scenario: Invite prompt after creation
- **WHEN** core property configuration is completed
- **THEN** the system SHALL prompt the user to invite members

#### Scenario: ICS feed prompt after creation
- **WHEN** property creation is completed
- **THEN** the system SHALL offer the user the option to subscribe to the property's ICS calendar feed

### Requirement: Invitations
Admins SHALL be able to invite users to a property by entering an email address and selecting a role (Admin or Member).

#### Scenario: Invite existing Hyttekabalen user
- **WHEN** an admin invites an email address belonging to an existing user
- **THEN** the system SHALL send a property invitation email via Resend with a deep link to the notification screen

#### Scenario: Invite new user
- **WHEN** an admin invites an email address not belonging to any existing user
- **THEN** the system SHALL send an email that serves as both a Hyttekabalen signup invitation and a property invitation, with a deep link to the notification screen

#### Scenario: Accept invitation
- **WHEN** an invitee accepts a property invitation from the notification screen
- **THEN** the system SHALL add them as a member of the property with the assigned role, notify all property admins, and offer the option to subscribe to the property's ICS calendar feed

#### Scenario: Reject invitation
- **WHEN** an invitee rejects a property invitation from the notification screen
- **THEN** the system SHALL mark the invitation as rejected and notify all property admins

#### Scenario: Invite from property info
- **WHEN** an admin invites a user from the property info screen
- **THEN** the system SHALL follow the same invitation flow as during property creation

### Requirement: Roles and membership
The system SHALL enforce two property-scoped roles: Admin and Member.

#### Scenario: Role permissions
- **WHEN** a user is an Admin of a property
- **THEN** they SHALL be able to edit property settings, manage rooms, invite/remove members, change roles, promote members to admin, and allocate quota periods to any member

#### Scenario: Member permissions
- **WHEN** a user is a Member of a property
- **THEN** they SHALL be able to view the booking overview, view property info, and make booking requests

#### Scenario: Different roles on different properties
- **WHEN** a user is a member of multiple properties
- **THEN** they SHALL have independent roles on each property

#### Scenario: Admin demotion safeguard
- **WHEN** an admin attempts to demote or remove any admin (including themselves)
- **THEN** the system SHALL allow it only if at least one other admin remains on the property

### Requirement: Property info
All members SHALL be able to view property information.

#### Scenario: View property info
- **WHEN** a member navigates to property info
- **THEN** the system SHALL display: rooms with names, descriptions, and bed configuration; member list with roles; and the unowned-day approval mode setting

#### Scenario: Admin edits property info
- **WHEN** an admin edits property info
- **THEN** the system SHALL allow editing: property name, add/edit/remove rooms, add/remove members, change member roles, and change the unowned-day approval mode

### Requirement: Property deletion
Admins SHALL be able to delete a property.

#### Scenario: Delete confirmation
- **WHEN** an admin initiates property deletion
- **THEN** the system SHALL present a confirmation requiring the admin to type the property name correctly to enable the delete action

#### Scenario: Soft delete
- **WHEN** a property is deleted
- **THEN** the system SHALL mark the property and all related data (bookings, memberships, quotas) as deleted; the property and its data SHALL NOT appear in any user-facing interface or be included in any way visible to users

#### Scenario: Deletion notification
- **WHEN** a property is deleted
- **THEN** all members SHALL be notified that the property has been deleted

### Requirement: No hard deletes
No data SHALL be hard deleted anywhere in the system. All deletions and rejections SHALL result in a final state persisted in the database, hidden from the UI.
