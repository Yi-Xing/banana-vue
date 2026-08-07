import { envConfig } from '@/config/env'
import type { ApiResponse } from '@/types/api'

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function resolveApiUrl(path: string): string {
  return envConfig.apiBaseUrl ? `${envConfig.apiBaseUrl}${path}` : path
}

export async function readApiData<T>(response: Response, fallbackMessage: string): Promise<T> {
  let payload: ApiResponse<T> | null = null

  try {
    payload = (await response.json()) as ApiResponse<T>
  } catch {
    // 非 JSON 错误响应交由下方统一处理。
  }

  if (!response.ok || !payload?.success) {
    throw new ApiError(payload?.message || fallbackMessage, response.status)
  }

  return payload.data
}
