export const PAGE_PERMISSIONS = {
  DASHBOARD: 'dashboard.page',
  ADMIN_CATEGORY: 'admin.category.page',
  ADMIN_FILE: 'admin.file.page',
  ADMIN_RECYCLE: 'admin.recycle.page',
  ADMIN_OSS: 'admin.oss.page',
  ADMIN_IMAGE: 'admin.image.page',
} as const

export const BUTTON_PERMISSIONS = {
  CATEGORY_ADD: 'admin.category.add.button',
  CATEGORY_UPDATE: 'admin.category.update.button',
  CATEGORY_DELETE: 'admin.category.delete.button',
  FILE_UPLOAD: 'admin.file.upload.button',
  FILE_UPDATE: 'admin.file.update.button',
  FILE_DELETE: 'admin.file.delete.button',
  RECYCLE_RESTORE: 'admin.recycle.restore.button',
  RECYCLE_PURGE: 'admin.recycle.purge.button',
  OSS_ADD: 'admin.oss.add.button',
  OSS_UPDATE: 'admin.oss.update.button',
  OSS_DELETE: 'admin.oss.delete.button',
  OSS_TEST: 'admin.oss.test.button',
} as const

export type PagePermission = (typeof PAGE_PERMISSIONS)[keyof typeof PAGE_PERMISSIONS]
export type ButtonPermission = (typeof BUTTON_PERMISSIONS)[keyof typeof BUTTON_PERMISSIONS]
