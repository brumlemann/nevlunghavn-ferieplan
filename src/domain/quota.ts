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
