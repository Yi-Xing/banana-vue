export const PAGE_PERMISSIONS = {
  HOME: 'home.page',
  ADMIN_OSS: 'admin.oss.page',
} as const

export const BUTTON_PERMISSIONS = {
  ADMIN_OSS_ADD: 'admin.oss.add.button',
} as const

export type PagePermission = (typeof PAGE_PERMISSIONS)[keyof typeof PAGE_PERMISSIONS]
export type ButtonPermission = (typeof BUTTON_PERMISSIONS)[keyof typeof BUTTON_PERMISSIONS]
