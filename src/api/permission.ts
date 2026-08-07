import { readApiData, resolveApiUrl } from '@/api/http'
import type { CurrentPermission } from '@/types/permission'

export async function getCurrentPermission(accessToken: string): Promise<CurrentPermission> {
  const response = await fetch(resolveApiUrl('/api/permission/current'), {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  })

  return readApiData<CurrentPermission>(response, '获取权限失败')
}
