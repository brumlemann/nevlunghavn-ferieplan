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
