import { apiRequest, buildQuery } from '@/api/request'
import type { BatchPurgeResult, FileInfo, FileQuery, PageData } from '@/types/file'

export const listRecycleBin = (query: FileQuery) =>
  apiRequest<PageData<FileInfo>>(`/api/admin/recycle-bin${buildQuery(query)}`, {}, '获取回收站失败')

export const restoreFile = (id: number) =>
  apiRequest<void>(
    '/api/admin/recycle-bin/restore',
    { method: 'POST', body: JSON.stringify({ id }) },
    '还原文件失败',
  )

export const purgeFile = (id: number) =>
  apiRequest<BatchPurgeResult>(
    `/api/admin/recycle-bin/file${buildQuery({ id })}`,
    { method: 'DELETE' },
    '彻底删除失败',
  )

export const purgeFiles = (ids: number[]) =>
  apiRequest<BatchPurgeResult>(
    '/api/admin/recycle-bin/purge',
    { method: 'POST', body: JSON.stringify({ ids }) },
    '批量删除失败',
  )

export const emptyRecycleBin = () =>
  apiRequest<BatchPurgeResult>('/api/admin/recycle-bin', { method: 'DELETE' }, '清空回收站失败')
