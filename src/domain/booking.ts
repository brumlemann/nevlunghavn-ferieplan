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
