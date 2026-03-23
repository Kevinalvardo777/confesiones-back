export interface ReportEntity {
  id: string
  targetType: 'confession' | 'comment'
  targetId: string
  reason: string
  details: string
  createdAt: string
  status: 'open' | 'reviewed' | 'dismissed'
}
