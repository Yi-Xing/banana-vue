import { createSsoLoginUrl, exchangeSsoCode, logoutSso } from '@/api/sso'
import type { SsoTokenData } from '@/types/auth'

export function beginSsoLogin(returnPath: string): void {
  const safeReturnPath =
    returnPath.startsWith('/') && !returnPath.startsWith('//') ? returnPath : '/'
  window.location.assign(createSsoLoginUrl(safeReturnPath))
}

export async function completeSsoLogin(code: string, state: string): Promise<SsoTokenData> {
  return exchangeSsoCode(code, state)
}

export async function logoutCurrentSession(accessToken: string): Promise<void> {
  await logoutSso(accessToken)
}
