## ADDED Requirements

### Requirement: Room inventory
The system SHALL maintain a registry of the five sleeping rooms in the summer house, each with a unique name, bed configuration, and capacity details.

#### Scenario: Seed room data
- **WHEN** the system is deployed for the first time
- **THEN** the database SHALL be seeded with the following five rooms:
  - **Fehn** (Sverre Fehn): Two separate single beds, no toddler bed, sleeps 2
  - **Knutsen** (Knut Knutsen): Double bed (conjoined), toddler bed possible, sleeps 2+1
  - **Utzon** (Jørn Utzon): Double bed (conjoined), toddler bed possible, sleeps 2+1
  - **Arneberg** (Arnstein Arneberg): Double bed (conjoined), no toddler bed, sleeps 2
  - **Korsmo** (Arne Korsmo): Double bed (conjoined), no toddler bed, sleeps 2

#### Scenario: View room details
- **WHEN** any authenticated user views the room information page
- **THEN** the system SHALL display each room's name, architect reference, bed configuration, toddler bed availability, and adult capacity

### Requirement: Administrator can update room details
An Administrator SHALL be able to update room descriptions and capacity details (e.g., if furniture changes), but SHALL NOT be able to add or remove rooms without a code change.

#### Scenario: Update room description
- **WHEN** an Administrator edits a room's description or capacity
- **THEN** the system SHALL save the changes and display the updated information to all users

#### Scenario: Room list is fixed
- **WHEN** an Administrator views room management
- **THEN** the system SHALL display the five rooms without options to add or delete rooms

### Requirement: Room selection in bookings
When creating a booking, the user SHALL select which rooms they need. The system SHALL offer two booking modes: partial (specific rooms) and whole-house (all rooms).

#### Scenario: Partial booking — select specific rooms
- **WHEN** a user creates a booking and selects one or more specific rooms (but not all five)
- **THEN** the system SHALL record the booking against only those rooms, and the remaining rooms SHALL remain available for other bookings in the same date range

#### Scenario: Whole-house booking
- **WHEN** a user creates a booking and selects "Whole house"
- **THEN** the system SHALL record the booking against all five rooms, indicating exclusive use of the house for that period

#### Scenario: Display available rooms for a date range
- **WHEN** a user selects a date range for a new booking
- **THEN** the system SHALL show which rooms are available (not claimed by another confirmed booking, excluding transition day overlaps) and which are taken, with the name of the occupying party visible

### Requirement: Transition day overlap
The system SHALL allow two bookings to coexist on a single day when one booking's end date equals the other booking's start date. This "transition day" represents a shared handover day.

#### Scenario: Transition day is allowed for same room
- **WHEN** booking A ends on June 15 in room Fehn and booking B starts on June 15 in room Fehn
- **THEN** the system SHALL permit both bookings without conflict, as June 15 is a transition day

#### Scenario: Multi-day overlap on same room is blocked
- **WHEN** booking A occupies room Fehn from June 10–15 and booking B requests room Fehn from June 14–20
- **THEN** the system SHALL flag a conflict because June 14 and June 15 are both occupied by both bookings (more than a single transition day overlap)

#### Scenario: Different rooms on same dates have no conflict
- **WHEN** booking A occupies room Fehn from June 10–15 and booking B requests room Knutsen from June 10–15
- **THEN** the system SHALL permit both bookings without conflict since they claim different rooms

#### Scenario: Transition day visibility on calendar
- **WHEN** a transition day exists (one booking ending, another starting)
- **THEN** the calendar SHALL visually indicate the overlap, showing both parties present on that day
