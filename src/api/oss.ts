import { apiRequest, buildQuery } from '@/api/request'
import type { OssConfig, OssPayload } from '@/types/file'

export const listOss = (state?: number) =>
  apiRequest<OssConfig[]>(`/api/admin/oss${buildQuery({ state })}`, {}, '获取OSS配置失败')

export const createOss = (payload: OssPayload) =>
  apiRequest<OssConfig>(
    '/api/admin/oss',
    { method: 'POST', body: JSON.stringify(payload) },
    '创建OSS失败',
  )

export const updateOss = (id: number, payload: OssPayload) =>
  apiRequest<OssConfig>(
    '/api/admin/oss',
    { method: 'PUT', body: JSON.stringify({ id, ...payload }) },
    '更新OSS失败',
  )

export const deleteOss = (id: number) =>
  apiRequest<void>(`/api/admin/oss${buildQuery({ id })}`, { method: 'DELETE' }, '删除OSS失败')

export const testOss = (payload: OssPayload) =>
  apiRequest<void>(
    '/api/admin/oss/test',
    { method: 'POST', body: JSON.stringify(payload) },
    'OSS连接测试失败',
  )

export const testSavedOss = (id: number) =>
  apiRequest<void>(
    '/api/admin/oss/test-saved',
    { method: 'POST', body: JSON.stringify({ id }) },
    'OSS连接测试失败',
  )
