import { ref } from 'vue'
import { defineStore } from 'pinia'

import { getCurrentUser } from '@/api/user'
import type { ButtonPermission, PagePermission } from '@/constants/permissionCode'
import type { CurrentUser } from '@/types/user'

export const usePermissionStore = defineStore('permission', () => {
  const pageCodeSet = ref<Set<string>>(new Set())
  const buttonCodeSet = ref<Set<string>>(new Set())
  const currentUser = ref<CurrentUser | null>(null)
  const hasLoadedCurrentUser = ref(false)
  const userPermissionVersion = ref(0)
  const systemPermissionVersion = ref(0)
  let loadingPromise: Promise<void> | null = null

  async function refresh(accessToken: string): Promise<void> {
    if (loadingPromise) return loadingPromise

    loadingPromise = (async () => {
      const user = await getCurrentUser(accessToken)
      currentUser.value = user
      pageCodeSet.value = new Set(user.pageCodeList)
      buttonCodeSet.value = new Set(user.buttonCodeList)
      userPermissionVersion.value = user.userPermissionVersion
      systemPermissionVersion.value = user.systemPermissionVersion
      hasLoadedCurrentUser.value = true
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
    currentUser.value = null
    hasLoadedCurrentUser.value = false
    userPermissionVersion.value = 0
    systemPermissionVersion.value = 0
  }

  return {
    pageCodeSet,
    buttonCodeSet,
    currentUser,
    hasLoadedCurrentUser,
    userPermissionVersion,
    systemPermissionVersion,
    refresh,
    hasPagePermission,
    hasButtonPermission,
    clear,
  }
})
