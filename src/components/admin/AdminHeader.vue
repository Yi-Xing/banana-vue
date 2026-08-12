<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { SwitchButton } from '@element-plus/icons-vue'

import bananaLogo from '@/assets/banana-logo.webp'
import { logoutCurrentSession } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import { usePermissionStore } from '@/stores/permission'

const router = useRouter()
const authStore = useAuthStore()
const permissionStore = usePermissionStore()
const loggingOut = ref(false)

async function logout(): Promise<void> {
  const token = authStore.getValidAccessToken()
  if (!token || loggingOut.value) return
  loggingOut.value = true
  try {
    await logoutCurrentSession(token)
  } catch {
    /* 本地会话仍需清理 */
  }
  authStore.clearSession()
  permissionStore.clear()
  ElMessage.success('已退出登录')
  await router.push('/')
  loggingOut.value = false
}
</script>

<template>
  <header class="admin-header">
    <RouterLink class="brand" to="/workspace">
      <img :src="bananaLogo" alt="" /><span>Banana 文件中心</span>
    </RouterLink>
    <button class="logout" type="button" :disabled="loggingOut" @click="logout">
      <el-icon><SwitchButton /></el-icon><span>退出</span>
    </button>
  </header>
</template>

<style scoped>
.admin-header {
  position: sticky;
  z-index: 20;
  top: 0;
  display: flex;
  height: 64px;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #e5e9df;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(14px);
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #20251d;
  font-weight: 750;
  text-decoration: none;
}
.brand img {
  width: 38px;
  height: 38px;
  object-fit: contain;
}
.logout {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 0;
  background: transparent;
  color: #6d7468;
  cursor: pointer;
  font: inherit;
}
</style>
