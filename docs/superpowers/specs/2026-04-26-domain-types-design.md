# Domain Types Design

## Context

Hyttekabalen is a multi-property cabin booking platform. This document defines the TypeScript domain types that model the core concepts across all features: users, properties, memberships, quotas, bookings, notifications, and ICS feed tokens.

The domain layer (`src/domain/`) contains pure TypeScript types and functions with no database or server action imports. Server actions call domain functions for logic, then call the database for persistence.

## Decisions

### One file per concept

Seven files, each owning one concept and all functions that operate on it:

```
src/domain/user.ts
src/domain/property.ts
src/domain/membership.ts
src/domain/quota.ts
src/domain/booking.ts
src/domain/notification.ts
src/domain/ics.ts
```

This follows the AGENTS.md convention directly and keeps files small and focused.

### Booking date range, not day-claims

`Booking` exposes `startDate` / `endDate`. `DayClaim` (individual day rows in the DB) is a persistence detail hidden from the domain in v1. When room-level booking is added in v2, DayClaims become a domain concept — the `Booking` type will gain a `dayClaims` array at that point.

### Discriminated unions over nullable fields

When a concept has meaningfully different variants, each variant is a union member carrying only the fields it needs. This applies to `ApprovalRoute` and `Notification`. Nullable fields that only apply to some variants are avoided.

### Interfaces for notification variants

Each notification type is its own `interface extends NotificationBase`, making the union itself readable at a glance. `actionable: true` marks the two types that require user action (property invitation, booking request approval).

### ICS feed is property-wide only for v1

Per-user feeds are out of scope. One token per property, no `userId` or `scope` field needed.

## Types

### `user.ts`

```ts
type User = {
  id: string
  name: string
  email: string
  createdAt: Date
}
```

No `image` field — not needed for v1. Identity comes from Auth.js; no provider details are duplicated here.

### `property.ts`

```ts
type UnownedDayApprovalMode = 'auto_approve' | 'admin_approval'

type Property = {
  id: string
  name: string
  unownedDayApprovalMode: UnownedDayApprovalMode
  createdAt: Date
  deletedAt: Date | null
}

type Room = {
  id: string
  propertyId: string
  name: string
  description: string
  doubleBeds: number
  singleBeds: number
  toddlerCribs: number
  deletedAt: Date | null
}
```

`Room` is present in the schema from day one (Decision 8 in design.md) but v1 never writes to it. `deletedAt` on both types for soft-delete.

### `membership.ts`

```ts
type MemberRole = 'admin' | 'member'

type Membership = {
  id: string
  userId: string
  propertyId: string
  role: MemberRole
  createdAt: Date
  deletedAt: Date | null
}

type InvitationStatus = 'pending' | 'accepted' | 'rejected'

type PropertyInvitation = {
  id: string
  propertyId: string
  email: string
  role: MemberRole
  invitedByUserId: string
  status: InvitationStatus
  createdAt: Date
  respondedAt: Date | null
}
```

`PropertyInvitation` is keyed on `email` rather than `userId` because the invitee may not have an account yet.

### `quota.ts`

```ts
type QuotaPeriod = {
  id: string
  propertyId: string
  userId: string
  startDate: Date
  endDate: Date
  createdAt: Date
  deletedAt: Date | null
}
```

Non-overlapping per property is enforced by the server action, not the type.

### `booking.ts`

```ts
type BookingStatus = 'requested' | 'approved' | 'rejected' | 'cancelled'

type ApprovalRoute =
  | { kind: 'auto' }
  | { kind: 'quota_holder'; quotaPeriodId: string; userId: string }
  | { kind: 'existing_booker'; bookingId: string; userId: string }
  | { kind: 'admin' }

type Booking = {
  id: string
  propertyId: string
  requesterId: string
  startDate: Date
  endDate: Date
  status: BookingStatus
  approvalRoute: ApprovalRoute
  message: string | null
  createdAt: Date
  resolvedAt: Date | null
  resolvedByUserId: string | null
}
```

`resolvedByUserId` captures who approved or rejected the booking. Null until status moves out of `requested`; remains null for `auto` route approvals.

`rejected` and `cancelled` are final states — hidden from the UI but persisted in the DB (no hard deletes).

### `notification.ts`

```ts
interface NotificationBase {
  id: string
  userId: string
  propertyId: string
  readAt: Date | null
  resolvedAt: Date | null
  createdAt: Date
}

interface PropertyInvitationNotification extends NotificationBase {
  type: 'property_invitation'
  invitationId: string
  actionable: true
}

interface BookingRequestNotification extends NotificationBase {
  type: 'booking_request'
  bookingId: string
  actionable: true
}

interface InvitationResponseNotification extends NotificationBase {
  type: 'invitation_response'
  invitationId: string
  actionable: false
}

interface PropertyDeletedNotification extends NotificationBase {
  type: 'property_deleted'
  actionable: false
}

interface BookingApprovedNotification extends NotificationBase {
  type: 'booking_approved'
  bookingId: string
  actionable: false
}

interface BookingRejectedNotification extends NotificationBase {
  type: 'booking_rejected'
  bookingId: string
  actionable: false
}

interface BookingCancelledNotification extends NotificationBase {
  type: 'booking_cancelled'
  bookingId: string
  actionable: false
}

interface QuotaAllocatedNotification extends NotificationBase {
  type: 'quota_allocated'
  quotaPeriodId: string
  actionable: false
}

interface QuotaChangedNotification extends NotificationBase {
  type: 'quota_changed'
  quotaPeriodId: string
  actionable: false
}

interface QuotaRemovedNotification extends NotificationBase {
  type: 'quota_removed'
  quotaPeriodId: string
  actionable: false
}

type Notification =
  | PropertyInvitationNotification
  | BookingRequestNotification
  | InvitationResponseNotification
  | PropertyDeletedNotification
  | BookingApprovedNotification
  | BookingRejectedNotification
  | BookingCancelledNotification
  | QuotaAllocatedNotification
  | QuotaChangedNotification
  | QuotaRemovedNotification
```

`actionable: true` on `PropertyInvitationNotification` and `BookingRequestNotification` — these are the only two types that require user action from the notification screen.

### `ics.ts`

```ts
type IcsFeedToken = {
  id: string
  propertyId: string
  token: string
  createdAt: Date
}
```

One token per property. Token is cryptographically random and used in the feed URL. Per-user feeds are out of scope for v1.
