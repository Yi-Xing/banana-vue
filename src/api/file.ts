import { apiDownload, apiRequest, buildQuery } from '@/api/request'
import { resolveApiUrl } from '@/api/http'
import { useAuthStore } from '@/stores/auth'
import type { ApiResponse } from '@/types/api'
import type { FileInfo, FileQuery, PageData } from '@/types/file'

export interface UploadFilePayload {
  file: File
  displayName: string
  categoryIds: number[]
  ossId?: number
  remark: string
}

export async function uploadFile(
  payload: UploadFilePayload,
  onProgress?: (percent: number) => void,
): Promise<FileInfo> {
  const form = new FormData()
  form.append('file', payload.file)
  form.append('displayName', payload.displayName)
  payload.categoryIds.forEach((id) => form.append('categoryIds', String(id)))
  if (payload.ossId) form.append('ossId', String(payload.ossId))
  form.append('remark', payload.remark)
  const token = useAuthStore().getValidAccessToken()
  if (!token) throw new Error('登录状态已失效')
  return new Promise<FileInfo>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', resolveApiUrl('/api/admin/files'))
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100))
    }
    xhr.onerror = () => reject(new Error('上传网络异常'))
    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText) as ApiResponse<FileInfo>
        if (xhr.status >= 200 && xhr.status < 300 && response.success) resolve(response.data)
        else reject(new Error(response.message || '上传文件失败'))
      } catch {
        reject(new Error('上传响应解析失败'))
      }
    }
    xhr.send(form)
  })
}

export const listFiles = (query: FileQuery) =>
  apiRequest<PageData<FileInfo>>(`/api/admin/files${buildQuery(query)}`, {}, '获取文件列表失败')

export const updateFile = (
  id: number,
  displayName: string,
  categoryIds: number[],
  remark: string,
) =>
  apiRequest<FileInfo>(
    '/api/admin/files',
    {
      method: 'PUT',
      body: JSON.stringify({ id, displayName, categoryIds, remark }),
    },
    '更新文件失败',
  )

export const recycleFile = (id: number) =>
  apiRequest<void>(`/api/admin/files${buildQuery({ id })}`, { method: 'DELETE' }, '移入回收站失败')

export const getFileAccessUrl = (id: number) =>
  apiRequest<{ url: string }>(
    `/api/admin/files/access${buildQuery({ id })}`,
    {},
    '获取访问地址失败',
  )

export const downloadFileBlob = (id: number) =>
  apiDownload(`/api/admin/files/download${buildQuery({ id })}`)

export const deleteFailedRecord = (id: number) =>
  apiRequest<void>(
    `/api/admin/files/failed-record${buildQuery({ id })}`,
    { method: 'DELETE' },
    '删除失败记录失败',
  )

export const retryDeleteFile = (id: number) =>
  apiRequest<void>(
    '/api/admin/files/retry-delete',
    { method: 'POST', body: JSON.stringify({ id }) },
    '重试删除失败',
  )
