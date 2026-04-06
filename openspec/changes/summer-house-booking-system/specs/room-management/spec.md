## ADDED Requirements

### Requirement: Room inventory
The system SHALL maintain a registry of the five sleeping rooms in the summer house, each with a unique name, bed configuration, capacity details, and an architect profile.

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

### Requirement: Architect profile overlays
Each room SHALL have a rich architect profile that users can view as an overlay popup. The profile SHALL include the architect's full name, lifespan, a short biography, notable works, and any family connection. External links (e.g., to museum collections) MAY be included.

#### Scenario: View architect profile from room listing
- **WHEN** a user clicks or taps on a room name or an info icon next to a room anywhere in the application (room list, booking form, calendar)
- **THEN** the system SHALL display an overlay popup with the architect's profile

#### Scenario: Seed architect profiles
- **WHEN** the system is deployed for the first time
- **THEN** the database SHALL be seeded with architect profiles for each room:
  - **Fehn**: Sverre Fehn (1924–2009). Norway's most internationally acclaimed architect. Awarded the Pritzker Architecture Prize in 1997. Known for the Nordic Pavilion in Venice (1962) and the Hedmark Museum in Hamar (1973). A master of integrating modernist principles with Nordic landscape and light.
  - **Knutsen**: Knut Knutsen (1903–1969). Pioneer of Norwegian organic modernism who championed architecture shaped by nature and site rather than imposed geometry. His own summer house at Portør (1949) became an icon of regionalist design and influenced a generation of Scandinavian architects.
  - **Utzon**: Jørn Utzon (1918–2008). Danish architect whose Sydney Opera House (1973) is one of the most recognisable buildings of the 20th century. Awarded the Pritzker Prize in 2003. Maintained a personal correspondence with the family's architects, connecting this house to an international circle of modernist thinkers.
  - **Arneberg**: Arnstein Arneberg (1882–1961). Designed Oslo City Hall together with Magnus Poulsson — one of Norway's most important public buildings. Also designed the United Nations Security Council Chamber in New York (1952). Bridged national romanticism and modernism.
  - **Korsmo**: Arne Korsmo (1900–1968). A central figure in Norwegian modernism and professor at NTH Trondheim. Villa Dammann in Oslo (1932) is regarded as a breakthrough for functionalism in Norway. Also collaborated with Terje Moe on [Villa Klein in Knardal, Halden](https://www.nasjonalmuseet.no/en/collection/object/NAMF.00472.002), where Moe — then Korsmo's research assistant — did much of the design work. The Korsmo room honours a personal connection between the family's own architects and one of Norway's most influential modernists.

#### Scenario: Administrator can edit architect profiles
- **WHEN** an Administrator edits an architect profile text
- **THEN** the system SHALL save the updated profile and display it in all subsequent overlay popups

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
