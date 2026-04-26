import { describe, it, expect } from 'bun:test'
import { isActionable, isUnread, isResolved } from './notification'
import type { Notification } from './notification'

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

describe('isResolved', () => {
  it('returns false when resolvedAt is null', () => {
    const n: Notification = { ...base, type: 'property_deleted', actionable: false }
    expect(isResolved(n)).toBe(false)
  })

  it('returns true when resolvedAt is set', () => {
    const n: Notification = { ...base, type: 'property_deleted', actionable: false, resolvedAt: new Date() }
    expect(isResolved(n)).toBe(true)
  })
})
