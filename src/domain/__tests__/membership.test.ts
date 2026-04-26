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
