import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

import { ApiError } from '@/api/http'
import { PAGE_PERMISSIONS } from '@/constants/permissionCode'
import { beginSsoLogin } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import { usePermissionStore } from '@/stores/permission'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'public-home', component: () => import('@/views/PublicHomeView.vue') },
    {
      path: '/',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'workspace',
          name: 'workspace',
          component: () => import('@/views/DashboardView.vue'),
          meta: { permission: PAGE_PERMISSIONS.DASHBOARD },
        },
        {
          path: 'admin/categories',
          name: 'categories',
          component: () => import('@/views/CategoryManageView.vue'),
          meta: { permission: PAGE_PERMISSIONS.ADMIN_CATEGORY },
        },
        {
          path: 'admin/files',
          name: 'files',
          component: () => import('@/views/FileManageView.vue'),
          meta: { permission: PAGE_PERMISSIONS.ADMIN_FILE },
        },
        {
          path: 'admin/images',
          name: 'images',
          component: () => import('@/views/ImageView.vue'),
          meta: { permission: PAGE_PERMISSIONS.ADMIN_IMAGE },
        },
        {
          path: 'admin/recycle-bin',
          name: 'recycle-bin',
          component: () => import('@/views/RecycleBinView.vue'),
          meta: { permission: PAGE_PERMISSIONS.ADMIN_RECYCLE },
        },
        {
          path: 'admin/oss',
          name: 'oss',
          component: () => import('@/views/OssManageView.vue'),
          meta: { permission: PAGE_PERMISSIONS.ADMIN_OSS },
        },
      ],
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
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
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
  const required = to.meta.permission
  if (required && !permissionStore.hasPagePermission(required)) return { name: 'forbidden' }
  return true
})

export default router
