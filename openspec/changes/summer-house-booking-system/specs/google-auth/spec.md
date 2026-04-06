## ADDED Requirements

### Requirement: Google OAuth sign-in
The system SHALL authenticate users exclusively via Google OAuth 2.0 (OpenID Connect). No username/password registration SHALL be supported.

#### Scenario: Successful sign-in
- **WHEN** an unauthenticated user visits the application
- **THEN** the system SHALL present a "Sign in with Google" button that initiates the OAuth flow

#### Scenario: First-time sign-in creates user record
- **WHEN** a user completes Google OAuth for the first time
- **THEN** the system SHALL create a user record storing their Google ID, email, and display name, and assign the Regular User role by default

#### Scenario: Returning user sign-in
- **WHEN** a user who has previously signed in completes Google OAuth
- **THEN** the system SHALL restore their existing session with their assigned role and permissions

### Requirement: OAuth token storage for Calendar API
The system SHALL request Google Calendar API scopes during authentication and store the OAuth access and refresh tokens securely for server-side Calendar API calls.

#### Scenario: Calendar scope consent
- **WHEN** a user signs in for the first time
- **THEN** the system SHALL request the `https://www.googleapis.com/auth/calendar.events` scope in addition to the basic profile scopes

#### Scenario: Token refresh
- **WHEN** the stored access token has expired
- **THEN** the system SHALL use the refresh token to obtain a new access token without requiring the user to re-authenticate

#### Scenario: Revoked token handling
- **WHEN** a refresh token is no longer valid (e.g., user revoked access)
- **THEN** the system SHALL prompt the user to re-authenticate on their next action requiring Calendar access

### Requirement: Session management
The system SHALL maintain authenticated sessions using secure HTTP-only cookies.

#### Scenario: Active session
- **WHEN** a user has a valid session cookie
- **THEN** the system SHALL allow access to protected routes without re-authentication

#### Scenario: Sign-out
- **WHEN** a user clicks "Sign out"
- **THEN** the system SHALL invalidate their session and redirect to the sign-in page
