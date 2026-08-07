import { watchEffect, type Directive } from 'vue'

import { usePermissionStore } from '@/stores/permission'

type PermissionElement = HTMLElement & {
  permissionStop?: () => void
}

export const permission: Directive<PermissionElement, string> = {
  mounted(el, binding) {
    const permissionStore = usePermissionStore()
    el.permissionStop = watchEffect(() => {
      el.style.display = permissionStore.hasButtonPermission(binding.value) ? '' : 'none'
    })
  },
  unmounted(el) {
    el.permissionStop?.()
    delete el.permissionStop
  },
}
