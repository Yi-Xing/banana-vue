import { envConfig } from '@/config/env'
import type { ApiResponse } from '@/types/api'
import type { SsoTokenData } from '@/types/auth'

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function resolveApiUrl(path: string): string {
  return envConfig.apiBaseUrl ? `${envConfig.apiBaseUrl}${path}` : path
}

export function createSsoLoginUrl(returnPath: string): string {
  const url = new URL(resolveApiUrl('/api/sso/login'), window.location.origin)
  url.searchParams.set('return_path', returnPath)
  return url.toString()
}

export async function exchangeSsoCode(code: string, state: string): Promise<SsoTokenData> {
  const url = new URL(resolveApiUrl('/api/sso/callback'), window.location.origin)
  url.searchParams.set('code', code)
  url.searchParams.set('state', state)

  const response = await fetch(url, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })

  return readApiData<SsoTokenData>(response, 'SSO 登录失败')
}

export async function logoutSso(accessToken: string): Promise<void> {
  const response = await fetch(resolveApiUrl('/api/sso/logout'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  await readApiData<null>(response, '退出登录失败')
}

async function readApiData<T>(response: Response, fallbackMessage: string): Promise<T> {
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
