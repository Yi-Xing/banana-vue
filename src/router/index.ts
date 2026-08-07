import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

import { ApiError } from '@/api/http'
import { PAGE_PERMISSIONS } from '@/constants/permissionCode'
import { beginSsoLogin } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import { usePermissionStore } from '@/stores/permission'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'public-home',
      component: () => import('@/views/PublicHomeView.vue'),
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true, permission: PAGE_PERMISSIONS.HOME },
    },
    {
      path: '/admin/oss',
      name: 'admin-oss',
      component: () => import('@/views/OssManageView.vue'),
      meta: { requiresAuth: true, permission: PAGE_PERMISSIONS.ADMIN_OSS },
    },
    {
      path: '/sso/callback',
      name: 'sso-callback',
      component: () => import('@/views/SsoCallbackView.vue'),
    },
    {
      path: '/403',
      name: 'forbidden',
      component: () => import('@/views/ForbiddenView.vue'),
      meta: { requiresAuth: true },
    },
  ],
  scrollBehavior: (to) => {
    if (to.hash) {
      return { el: to.hash, top: 72 }
    }

    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  const authStore = useAuthStore()
  const accessToken = authStore.getValidAccessToken()
  if (!accessToken) {
    beginSsoLogin(to.fullPath)
    return false
  }

  const permissionStore = usePermissionStore()
  try {
    await permissionStore.refresh(accessToken)
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      authStore.clearSession()
      permissionStore.clear()
      beginSsoLogin(to.fullPath)
      return false
    }
    ElMessage.error(error instanceof Error ? error.message : '获取权限失败')
    return false
  }

  const requiredPermission = to.meta.permission
  if (requiredPermission && !permissionStore.hasPagePermission(requiredPermission)) {
    return to.name === 'forbidden' ? true : { name: 'forbidden' }
  }

  return true
})

export default router
