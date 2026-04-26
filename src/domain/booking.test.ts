import { describe, it, expect } from 'bun:test'
import { isActiveBooking, approverUserId } from './booking'
import type { Booking } from './booking'

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
