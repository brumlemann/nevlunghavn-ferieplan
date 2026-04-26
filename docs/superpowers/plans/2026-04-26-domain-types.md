# Domain Types Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the seven domain type files under `src/domain/` with pure TypeScript types and the minimal set of pure functions needed to use them correctly.

**Architecture:** Domain files are pure — no database calls, no server action imports, no side effects. Each file owns one concept and all pure functions that operate on it. Tests use Bun's built-in test runner (`bun test`). TypeScript compilation (`bunx tsc --noEmit`) is the compile-time type check.

**Tech Stack:** TypeScript, Bun test runner (`bun:test`), strict tsconfig already configured.

---

## File Structure

| File | Responsibility |
|------|---------------|
| `src/domain/user.ts` | `User` type |
| `src/domain/property.ts` | `Property`, `Room`, `UnownedDayApprovalMode`, `isAutoApprove` |
| `src/domain/membership.ts` | `MemberRole`, `Membership`, `InvitationStatus`, `PropertyInvitation`, `isAdmin` |
| `src/domain/quota.ts` | `QuotaPeriod`, `overlaps`, `containsDate` |
| `src/domain/booking.ts` | `BookingStatus`, `ApprovalRoute`, `Booking`, `isActiveBooking`, `approverUserId` |
| `src/domain/notification.ts` | `NotificationBase`, all notification interfaces, `Notification` union, `isActionable`, `isUnread` |
| `src/domain/ics.ts` | `IcsFeedToken` type |
| `src/domain/__tests__/property.test.ts` | Tests for `isAutoApprove` |
| `src/domain/__tests__/membership.test.ts` | Tests for `isAdmin` |
| `src/domain/__tests__/quota.test.ts` | Tests for `overlaps`, `containsDate` |
| `src/domain/__tests__/booking.test.ts` | Tests for `isActiveBooking`, `approverUserId` |
| `src/domain/__tests__/notification.test.ts` | Tests for `isActionable`, `isUnread` |

---

### Task 1: user.ts and ics.ts

Pure types with no functions — no tests needed beyond TypeScript compilation.

**Files:**
- Create: `src/domain/user.ts`
- Create: `src/domain/ics.ts`

- [ ] **Step 1: Create `src/domain/user.ts`**

```ts
export type User = {
  id: string
  name: string
  email: string
  createdAt: Date
}
```

- [ ] **Step 2: Create `src/domain/ics.ts`**

```ts
export type IcsFeedToken = {
  id: string
  propertyId: string
  token: string
  createdAt: Date
}
```

- [ ] **Step 3: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/domain/user.ts src/domain/ics.ts
git commit -m "feat(domain): add User and IcsFeedToken types"
```

---

### Task 2: property.ts

**Files:**
- Create: `src/domain/property.ts`
- Create: `src/domain/__tests__/property.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/domain/__tests__/property.test.ts`:

```ts
import { describe, it, expect } from 'bun:test'
import { isAutoApprove } from '../property'
import type { Property } from '../property'

const base: Property = {
  id: 'p1',
  name: 'Nevlunghavn',
  unownedDayApprovalMode: 'auto_approve',
  createdAt: new Date(),
  deletedAt: null,
}

describe('isAutoApprove', () => {
  it('returns true when mode is auto_approve', () => {
    expect(isAutoApprove(base)).toBe(true)
  })

  it('returns false when mode is admin_approval', () => {
    expect(isAutoApprove({ ...base, unownedDayApprovalMode: 'admin_approval' })).toBe(false)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
bun test src/domain/__tests__/property.test.ts
```

Expected: error — `Cannot find module '../property'`

- [ ] **Step 3: Create `src/domain/property.ts`**

```ts
export type UnownedDayApprovalMode = 'auto_approve' | 'admin_approval'

export type Property = {
  id: string
  name: string
  unownedDayApprovalMode: UnownedDayApprovalMode
  createdAt: Date
  deletedAt: Date | null
}

export type Room = {
  id: string
  propertyId: string
  name: string
  description: string
  doubleBeds: number
  singleBeds: number
  toddlerCribs: number
  deletedAt: Date | null
}

export function isAutoApprove(property: Property): boolean {
  return property.unownedDayApprovalMode === 'auto_approve'
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
bun test src/domain/__tests__/property.test.ts
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/domain/property.ts src/domain/__tests__/property.test.ts
git commit -m "feat(domain): add Property, Room types and isAutoApprove"
```

---

### Task 3: membership.ts

**Files:**
- Create: `src/domain/membership.ts`
- Create: `src/domain/__tests__/membership.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/domain/__tests__/membership.test.ts`:

```ts
import { describe, it, expect } from 'bun:test'
import { isAdmin } from '../membership'
import type { Membership } from '../membership'

const base: Membership = {
  id: 'm1',
  userId: 'u1',
  propertyId: 'p1',
  role: 'admin',
  createdAt: new Date(),
  deletedAt: null,
}

describe('isAdmin', () => {
  it('returns true for admin role', () => {
    expect(isAdmin(base)).toBe(true)
  })

  it('returns false for member role', () => {
    expect(isAdmin({ ...base, role: 'member' })).toBe(false)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
bun test src/domain/__tests__/membership.test.ts
```

Expected: error — `Cannot find module '../membership'`

- [ ] **Step 3: Create `src/domain/membership.ts`**

```ts
export type MemberRole = 'admin' | 'member'

export type Membership = {
  id: string
  userId: string
  propertyId: string
  role: MemberRole
  createdAt: Date
  deletedAt: Date | null
}

export type InvitationStatus = 'pending' | 'accepted' | 'rejected'

export type PropertyInvitation = {
  id: string
  propertyId: string
  email: string
  role: MemberRole
  invitedByUserId: string
  status: InvitationStatus
  createdAt: Date
  respondedAt: Date | null
}

export function isAdmin(membership: Membership): boolean {
  return membership.role === 'admin'
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
bun test src/domain/__tests__/membership.test.ts
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/domain/membership.ts src/domain/__tests__/membership.test.ts
git commit -m "feat(domain): add Membership, PropertyInvitation types and isAdmin"
```

---

### Task 4: quota.ts

**Files:**
- Create: `src/domain/quota.ts`
- Create: `src/domain/__tests__/quota.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/domain/__tests__/quota.test.ts`:

```ts
import { describe, it, expect } from 'bun:test'
import { overlaps, containsDate } from '../quota'
import type { QuotaPeriod } from '../quota'

function makeQuota(start: string, end: string): QuotaPeriod {
  return {
    id: 'q1',
    propertyId: 'p1',
    userId: 'u1',
    startDate: new Date(start),
    endDate: new Date(end),
    createdAt: new Date(),
    deletedAt: null,
  }
}

describe('overlaps', () => {
  it('returns true when ranges overlap in the middle', () => {
    const a = makeQuota('2026-06-01', '2026-06-15')
    const b = makeQuota('2026-06-10', '2026-06-20')
    expect(overlaps(a, b)).toBe(true)
  })

  it('returns true when ranges share a single boundary date', () => {
    const a = makeQuota('2026-06-01', '2026-06-10')
    const b = makeQuota('2026-06-10', '2026-06-20')
    expect(overlaps(a, b)).toBe(true)
  })

  it('returns false when ranges are completely separate', () => {
    const a = makeQuota('2026-06-01', '2026-06-09')
    const b = makeQuota('2026-06-10', '2026-06-20')
    expect(overlaps(a, b)).toBe(false)
  })

  it('is commutative — overlaps(a, b) equals overlaps(b, a)', () => {
    const a = makeQuota('2026-06-01', '2026-06-15')
    const b = makeQuota('2026-06-10', '2026-06-20')
    expect(overlaps(a, b)).toBe(overlaps(b, a))
  })
})

describe('containsDate', () => {
  const quota = makeQuota('2026-06-10', '2026-06-20')

  it('returns true for a date inside the range', () => {
    expect(containsDate(quota, new Date('2026-06-15'))).toBe(true)
  })

  it('returns true for the start date (inclusive)', () => {
    expect(containsDate(quota, new Date('2026-06-10'))).toBe(true)
  })

  it('returns true for the end date (inclusive)', () => {
    expect(containsDate(quota, new Date('2026-06-20'))).toBe(true)
  })

  it('returns false for a date before the range', () => {
    expect(containsDate(quota, new Date('2026-06-09'))).toBe(false)
  })

  it('returns false for a date after the range', () => {
    expect(containsDate(quota, new Date('2026-06-21'))).toBe(false)
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
bun test src/domain/__tests__/quota.test.ts
```

Expected: error — `Cannot find module '../quota'`

- [ ] **Step 3: Create `src/domain/quota.ts`**

Date comparisons use JavaScript's built-in numeric coercion on Date objects (`<=`, `>=`), which compares millisecond timestamps. Both `startDate` and `endDate` are inclusive.

```ts
export type QuotaPeriod = {
  id: string
  propertyId: string
  userId: string
  startDate: Date
  endDate: Date
  createdAt: Date
  deletedAt: Date | null
}

export function overlaps(a: QuotaPeriod, b: QuotaPeriod): boolean {
  return a.startDate <= b.endDate && b.startDate <= a.endDate
}

export function containsDate(quota: QuotaPeriod, date: Date): boolean {
  return quota.startDate <= date && date <= quota.endDate
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
bun test src/domain/__tests__/quota.test.ts
```

Expected: 9 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/domain/quota.ts src/domain/__tests__/quota.test.ts
git commit -m "feat(domain): add QuotaPeriod type with overlaps and containsDate"
```

---

### Task 5: booking.ts

**Files:**
- Create: `src/domain/booking.ts`
- Create: `src/domain/__tests__/booking.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/domain/__tests__/booking.test.ts`:

```ts
import { describe, it, expect } from 'bun:test'
import { isActiveBooking, approverUserId } from '../booking'
import type { Booking } from '../booking'

const base: Booking = {
  id: 'b1',
  propertyId: 'p1',
  requesterId: 'u1',
  startDate: new Date('2026-07-01'),
  endDate: new Date('2026-07-07'),
  status: 'requested',
  approvalRoute: { kind: 'auto' },
  message: null,
  createdAt: new Date(),
  resolvedAt: null,
  resolvedByUserId: null,
}

describe('isActiveBooking', () => {
  it('returns true for requested status', () => {
    expect(isActiveBooking({ ...base, status: 'requested' })).toBe(true)
  })

  it('returns true for approved status', () => {
    expect(isActiveBooking({ ...base, status: 'approved' })).toBe(true)
  })

  it('returns false for rejected status', () => {
    expect(isActiveBooking({ ...base, status: 'rejected' })).toBe(false)
  })

  it('returns false for cancelled status', () => {
    expect(isActiveBooking({ ...base, status: 'cancelled' })).toBe(false)
  })
})

describe('approverUserId', () => {
  it('returns null for auto route', () => {
    expect(approverUserId({ ...base, approvalRoute: { kind: 'auto' } })).toBeNull()
  })

  it('returns null for admin route', () => {
    expect(approverUserId({ ...base, approvalRoute: { kind: 'admin' } })).toBeNull()
  })

  it('returns the userId for quota_holder route', () => {
    expect(
      approverUserId({ ...base, approvalRoute: { kind: 'quota_holder', quotaPeriodId: 'q1', userId: 'u2' } })
    ).toBe('u2')
  })

  it('returns the userId for existing_booker route', () => {
    expect(
      approverUserId({ ...base, approvalRoute: { kind: 'existing_booker', bookingId: 'b2', userId: 'u3' } })
    ).toBe('u3')
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
bun test src/domain/__tests__/booking.test.ts
```

Expected: error — `Cannot find module '../booking'`

- [ ] **Step 3: Create `src/domain/booking.ts`**

```ts
export type BookingStatus = 'requested' | 'approved' | 'rejected' | 'cancelled'

export type ApprovalRoute =
  | { kind: 'auto' }
  | { kind: 'quota_holder'; quotaPeriodId: string; userId: string }
  | { kind: 'existing_booker'; bookingId: string; userId: string }
  | { kind: 'admin' }

export type Booking = {
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

export function isActiveBooking(booking: Booking): boolean {
  return booking.status === 'requested' || booking.status === 'approved'
}

export function approverUserId(booking: Booking): string | null {
  const route = booking.approvalRoute
  if (route.kind === 'quota_holder' || route.kind === 'existing_booker') {
    return route.userId
  }
  return null
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
bun test src/domain/__tests__/booking.test.ts
```

Expected: 8 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/domain/booking.ts src/domain/__tests__/booking.test.ts
git commit -m "feat(domain): add Booking type with isActiveBooking and approverUserId"
```

---

### Task 6: notification.ts

**Files:**
- Create: `src/domain/notification.ts`
- Create: `src/domain/__tests__/notification.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/domain/__tests__/notification.test.ts`:

```ts
import { describe, it, expect } from 'bun:test'
import { isActionable, isUnread } from '../notification'
import type { Notification } from '../notification'

const base = {
  id: 'n1',
  userId: 'u1',
  propertyId: 'p1',
  readAt: null,
  resolvedAt: null,
  createdAt: new Date(),
}

describe('isActionable', () => {
  it('returns true for property_invitation', () => {
    const n: Notification = { ...base, type: 'property_invitation', invitationId: 'i1', actionable: true }
    expect(isActionable(n)).toBe(true)
  })

  it('returns true for booking_request', () => {
    const n: Notification = { ...base, type: 'booking_request', bookingId: 'b1', actionable: true }
    expect(isActionable(n)).toBe(true)
  })

  it('returns false for booking_approved', () => {
    const n: Notification = { ...base, type: 'booking_approved', bookingId: 'b1', actionable: false }
    expect(isActionable(n)).toBe(false)
  })

  it('returns false for property_deleted', () => {
    const n: Notification = { ...base, type: 'property_deleted', actionable: false }
    expect(isActionable(n)).toBe(false)
  })
})

describe('isUnread', () => {
  it('returns true when readAt is null', () => {
    const n: Notification = { ...base, type: 'property_deleted', actionable: false }
    expect(isUnread(n)).toBe(true)
  })

  it('returns false when readAt is set', () => {
    const n: Notification = { ...base, type: 'property_deleted', actionable: false, readAt: new Date() }
    expect(isUnread(n)).toBe(false)
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
bun test src/domain/__tests__/notification.test.ts
```

Expected: error — `Cannot find module '../notification'`

- [ ] **Step 3: Create `src/domain/notification.ts`**

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

export type Notification =
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

export function isActionable(
  notification: Notification
): notification is PropertyInvitationNotification | BookingRequestNotification {
  return notification.type === 'property_invitation' || notification.type === 'booking_request'
}

export function isUnread(notification: Notification): boolean {
  return notification.readAt === null
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
bun test src/domain/__tests__/notification.test.ts
```

Expected: 6 tests pass.

- [ ] **Step 5: Run all domain tests together**

```bash
bun test src/domain/__tests__/
```

Expected: all tests pass (27 total across 5 test files).

- [ ] **Step 6: Type-check the whole project**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/domain/notification.ts src/domain/__tests__/notification.test.ts
git commit -m "feat(domain): add Notification union type with isActionable and isUnread"
```
