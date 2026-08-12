<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import bananaLogo from '@/assets/banana-logo.webp'
import { ApiError } from '@/api/http'
import { PAGE_PERMISSIONS } from '@/constants/permissionCode'
import { logoutCurrentSession } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import { usePermissionStore } from '@/stores/permission'

const authStore = useAuthStore()
const permissionStore = usePermissionStore()
const router = useRouter()
const isLoggingOut = ref(false)

async function handleLogout(): Promise<void> {
  const accessToken = authStore.getValidAccessToken()
  if (!accessToken || isLoggingOut.value) return

  isLoggingOut.value = true
  try {
    await logoutCurrentSession(accessToken)
    authStore.clearSession()
    permissionStore.clear()
    ElMessage.success('已退出所有关联登录会话')
    await router.push('/')
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      authStore.clearSession()
      permissionStore.clear()
      ElMessage.warning('登录会话已失效，请重新登录')
      await router.push('/')
      return
    }

    ElMessage.error(error instanceof Error ? error.message : '退出登录失败')
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<template>
  <header class="site-header">
    <div class="page-container header-inner">
      <RouterLink class="brand" to="/" aria-label="返回 Banana Vue 首页">
        <span class="brand-mark">
          <img :src="bananaLogo" alt="" />
        </span>
        <span>Banana Vue</span>
      </RouterLink>

      <nav class="main-nav" aria-label="主导航">
        <RouterLink to="/admin/dashboard#foundation">项目基础</RouterLink>
        <RouterLink to="/admin/dashboard#structure">目录结构</RouterLink>
        <RouterLink
          v-if="permissionStore.hasPagePermission(PAGE_PERMISSIONS.ADMIN_OSS)"
          to="/admin/oss"
        >
          OSS 管理
        </RouterLink>
      </nav>

      <button class="header-action" type="button" :disabled="isLoggingOut" @click="handleLogout">
        {{ isLoggingOut ? '正在退出…' : '退出登录' }}
      </button>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  z-index: 20;
  top: 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: rgba(255, 254, 250, 0.9);
  backdrop-filter: blur(18px);
}

.header-inner {
  display: grid;
  min-height: 72px;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 28px;
}

.brand {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 10px;
  color: var(--ink-strong);
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-decoration: none;
}

.brand-mark {
  display: grid;
  width: 36px;
  height: 36px;
  overflow: hidden;
  place-items: center;
  border: 1px solid rgba(213, 173, 43, 0.2);
  border-radius: 10px 4px 10px 4px;
  background: var(--banana-soft);
}

.brand-mark img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 30px;
}

.main-nav a {
  color: var(--ink-muted);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: color 180ms ease;
}

.main-nav a:hover {
  color: var(--brand);
}

.header-action {
  justify-self: end;
  padding: 0;
  border: 0;
  border-bottom: 2px solid var(--banana-deep);
  background: transparent;
  color: var(--ink-strong);
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  line-height: 30px;
  text-decoration: none;
}

.header-action:disabled {
  cursor: wait;
  opacity: 0.58;
}

@media (max-width: 720px) {
  .header-inner {
    min-height: 64px;
    grid-template-columns: 1fr auto;
  }

  .main-nav {
    display: none;
  }
}

@media (max-width: 420px) {
  .header-action {
    display: none;
  }
}
</style>
