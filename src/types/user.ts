export interface CurrentUser {
  id: number
  name: string
  email: string
  phone: string
  remark: string
  expireTime: string
  userPermissionVersion: number
  systemPermissionVersion: number
  pageCodeList: string[]
  buttonCodeList: string[]
}
