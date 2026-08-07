import { readApiData, resolveApiUrl } from '@/api/http'

export interface OssAddRequest {
  name: string
  type: number | null
  code: string
  state: number | null
  domainName: string
  accessKey: string
  secretKey: string
  remark: string
}

export interface OssInfo {
  id: number
  name: string
  type: number
  code: string
  state: number
  domainName: string
  accessKey: string
  secretKey: string
  remark: string
  createdTime: string
  updatedTime: string
}

export async function addOss(accessToken: string, request: OssAddRequest): Promise<OssInfo> {
  const response = await fetch(resolveApiUrl('/api/admin/oss'), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  return readApiData<OssInfo>(response, '新增 OSS 失败')
}
