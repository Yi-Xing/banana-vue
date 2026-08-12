import { apiRequest } from '@/api/request'
import type { DashboardSummary } from '@/types/file'

export const getDashboardSummary = () =>
  apiRequest<DashboardSummary>('/api/admin/dashboard/summary', {}, '获取工作台数据失败')
