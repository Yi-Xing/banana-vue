import { readApiData, resolveApiUrl } from '@/api/http'
import { useAuthStore } from '@/stores/auth'

type QueryValue = string | number | boolean | Array<string | number> | undefined | null

export function buildQuery(params: object): string {
  const query = new URLSearchParams()
  Object.entries(params as Record<string, QueryValue>).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, String(item)))
    } else {
      query.append(key, String(value))
    }
  })
  const result = query.toString()
  return result ? `?${result}` : ''
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  fallbackMessage = '请求失败',
): Promise<T> {
  const token = useAuthStore().getValidAccessToken()
  if (!token) throw new Error('登录状态已失效')

  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  headers.set('Authorization', `Bearer ${token}`)
  if (init.body && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json')

  const response = await fetch(resolveApiUrl(path), { ...init, headers })
  return readApiData<T>(response, fallbackMessage)
}

export async function apiDownload(path: string, fallbackMessage = '下载失败'): Promise<Blob> {
  const token = useAuthStore().getValidAccessToken()
  if (!token) throw new Error('登录状态已失效')
  const response = await fetch(resolveApiUrl(path), {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const payload = (await response.json()) as { message?: string }
      throw new Error(payload.message || fallbackMessage)
    }
    try {
      const message = (await response.text()).trim()
      throw new Error(message || fallbackMessage)
    } catch (error) {
      if (error instanceof Error) throw error
      throw new Error(fallbackMessage)
    }
  }
  return response.blob()
}
