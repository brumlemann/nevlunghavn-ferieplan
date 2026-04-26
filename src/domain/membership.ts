export type MemberRole = 'admin' | 'member'

export type Membership = {
  id: string
  userId: string
  propertyId: string
  role: MemberRole
  createdAt: Date
  deletedAt: Date | null
}

export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled'

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
