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
