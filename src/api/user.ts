import { readApiData, resolveApiUrl } from '@/api/http'
import type { CurrentUser } from '@/types/user'

export async function getCurrentUser(accessToken: string): Promise<CurrentUser> {
  const response = await fetch(resolveApiUrl('/api/user/current'), {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  })

  return readApiData<CurrentUser>(response, '获取当前用户失败')
}
