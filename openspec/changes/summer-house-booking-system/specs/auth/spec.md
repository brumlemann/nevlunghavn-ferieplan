## ADDED Requirements

### Requirement: Multi-provider authentication
The system SHALL support authentication via Auth.js with multiple providers: Google, Apple, and email magic links.

#### Scenario: Sign up via Google or Apple
- **WHEN** a new user authenticates via Google or Apple
- **THEN** the system SHALL create a user record with the email address obtained from the provider metadata and redirect the user to the user dashboard

#### Scenario: Sign up via email magic link
- **WHEN** a new user authenticates via email magic link
- **THEN** the system SHALL create a user record with the verified email address and redirect the user to the user dashboard

#### Scenario: Sign up via invitation deep link
- **WHEN** a new user authenticates after following a deep link from a property invitation email
- **THEN** the system SHALL create a user record and redirect the user to the notification screen where the invitation is visible

#### Scenario: Returning user logs in
- **WHEN** an existing user authenticates
- **THEN** the system SHALL restore the session and redirect the user to the user dashboard

### Requirement: Email is mandatory
The system SHALL require a verified email address for every user account.

#### Scenario: Email obtained from OAuth provider
- **WHEN** a user authenticates via Google or Apple and the provider supplies an email address
- **THEN** the system SHALL use that email for the user record

#### Scenario: Email obtained via magic link
- **WHEN** a user authenticates via email magic link
- **THEN** the email used for the magic link SHALL be the user's verified email

### Requirement: Session and token management
Auth tokens and sessions SHALL be managed by Auth.js.

#### Scenario: Token expires
- **WHEN** a user's auth token expires or is revoked
- **THEN** the system SHALL prompt the user to re-authenticate without data loss

### Requirement: No calendar OAuth scopes
The system SHALL NOT request any calendar-related OAuth scopes during authentication.
