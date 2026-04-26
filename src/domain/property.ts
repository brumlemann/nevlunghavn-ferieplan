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
