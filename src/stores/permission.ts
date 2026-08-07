import { ref } from 'vue'
import { defineStore } from 'pinia'

import { getCurrentPermission } from '@/api/permission'
import type { ButtonPermission, PagePermission } from '@/constants/permissionCode'

export const usePermissionStore = defineStore('permission', () => {
  const pageCodeSet = ref<Set<string>>(new Set())
  const buttonCodeSet = ref<Set<string>>(new Set())
  const userPermissionVersion = ref(0)
  const systemPermissionVersion = ref(0)
  let loadingPromise: Promise<void> | null = null

  async function refresh(accessToken: string): Promise<void> {
    if (loadingPromise) return loadingPromise

    loadingPromise = (async () => {
      const permission = await getCurrentPermission(accessToken)
      pageCodeSet.value = new Set(permission.pageCodeList)
      buttonCodeSet.value = new Set(permission.buttonCodeList)
      userPermissionVersion.value = permission.userPermissionVersion
      systemPermissionVersion.value = permission.systemPermissionVersion
    })()

    try {
      return await loadingPromise
    } finally {
      loadingPromise = null
    }
  }

  function hasPagePermission(permission: PagePermission | string): boolean {
    return pageCodeSet.value.has(permission)
  }

  function hasButtonPermission(permission: ButtonPermission | string): boolean {
    return buttonCodeSet.value.has(permission)
  }

  function clear(): void {
    pageCodeSet.value = new Set()
    buttonCodeSet.value = new Set()
    userPermissionVersion.value = 0
    systemPermissionVersion.value = 0
  }

  return {
    pageCodeSet,
    buttonCodeSet,
    userPermissionVersion,
    systemPermissionVersion,
    refresh,
    hasPagePermission,
    hasButtonPermission,
    clear,
  }
})
