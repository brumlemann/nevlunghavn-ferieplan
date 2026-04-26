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
