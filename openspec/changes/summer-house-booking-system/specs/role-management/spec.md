## ADDED Requirements

### Requirement: Three-tier role model
The system SHALL support exactly three roles: Administrator, Quota Owner, and Regular User. Every authenticated user SHALL have exactly one role.

#### Scenario: Default role assignment
- **WHEN** a new user signs in for the first time
- **THEN** the system SHALL assign them the Regular User role

#### Scenario: Role hierarchy
- **WHEN** determining permissions
- **THEN** Administrator SHALL have all permissions, Quota Owner SHALL have quota management and booking approval permissions for their own periods, and Regular User SHALL have booking request permissions only

### Requirement: Administrator can manage roles
An Administrator SHALL be able to assign or change the role of any user in the system.

#### Scenario: Promote user to Quota Owner
- **WHEN** an Administrator assigns the Quota Owner role to a Regular User
- **THEN** that user SHALL gain quota management and booking approval capabilities

#### Scenario: Demote Quota Owner to Regular User
- **WHEN** an Administrator changes a Quota Owner's role to Regular User
- **THEN** that user SHALL lose quota management capabilities, and their existing quota periods SHALL remain but require reassignment to another Quota Owner

#### Scenario: Non-administrator cannot change roles
- **WHEN** a Quota Owner or Regular User attempts to change another user's role
- **THEN** the system SHALL deny the request

### Requirement: Administrator can manage users
An Administrator SHALL be able to view all users, deactivate user accounts, and reactivate them.

#### Scenario: View all users
- **WHEN** an Administrator navigates to the user management page
- **THEN** the system SHALL display a list of all users with their name, email, role, and account status

#### Scenario: Deactivate a user
- **WHEN** an Administrator deactivates a user account
- **THEN** that user SHALL be unable to sign in or make booking requests until reactivated

#### Scenario: First administrator bootstrap
- **WHEN** the system is deployed with no existing users
- **THEN** the first user to sign in SHALL be automatically assigned the Administrator role
