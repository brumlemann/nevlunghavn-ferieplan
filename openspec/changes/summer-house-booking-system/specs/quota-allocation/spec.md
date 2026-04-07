## ADDED Requirements

### Requirement: Quota period definition
An Administrator SHALL be able to define the vacation season and divide it into quota periods, each assigned to a Quota Owner.

#### Scenario: Create a season with default dates
- **WHEN** an Administrator creates a new season for a given year without specifying dates
- **THEN** the system SHALL default to June 1 through August 31 of that year

#### Scenario: Create a season with custom dates
- **WHEN** an Administrator defines a new season with explicit start and end dates
- **THEN** the system SHALL create a season that spans those dates, overriding the default

#### Scenario: Allocate a quota period
- **WHEN** an Administrator assigns a date range within the season to a Quota Owner
- **THEN** the system SHALL record that period as belonging to that Quota Owner

#### Scenario: Prevent overlapping quota periods
- **WHEN** an Administrator attempts to create a quota period that overlaps with an existing one
- **THEN** the system SHALL reject the allocation and display an error message

### Requirement: Quota Owner views their periods
A Quota Owner SHALL be able to view all quota periods assigned to them across all seasons.

#### Scenario: View own quota periods
- **WHEN** a Quota Owner navigates to their quota overview
- **THEN** the system SHALL display all their assigned periods with dates, season name, and current booking status

### Requirement: Unallocated periods are visible
Any date within a season that is not assigned to a Quota Owner SHALL be marked as unallocated and visible to all users.

#### Scenario: Display unallocated dates
- **WHEN** a user views the season calendar
- **THEN** dates not assigned to any Quota Owner SHALL be visually distinguished as unallocated

#### Scenario: Administrator allocates previously unallocated dates
- **WHEN** an Administrator assigns an unallocated date range to a Quota Owner
- **THEN** those dates SHALL become part of that Quota Owner's quota period

### Requirement: Season template reuse
An Administrator SHALL be able to copy a previous season's quota allocation as a template for a new season.

#### Scenario: Copy season template
- **WHEN** an Administrator creates a new season and selects a previous season as template
- **THEN** the system SHALL pre-fill the quota period allocations with the same structure (same Quota Owners, adjusted dates), which the Administrator can then modify before confirming
