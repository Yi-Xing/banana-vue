<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

import defaultAvatar from '@/assets/DefaultAvatar.png'
import bananaLogo from '@/assets/banana-logo.webp'
import { logoutCurrentSession } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import { usePermissionStore } from '@/stores/permission'

const router = useRouter()
const authStore = useAuthStore()
const permissionStore = usePermissionStore()
const loggingOut = ref(false)
const profileDialogVisible = ref(false)

function showProfile(): void {
  profileDialogVisible.value = true
}

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
  <el-header class="admin-header">
    <div class="header-content">
      <RouterLink class="brand" to="/admin/dashboard">
        <img :src="bananaLogo" alt="Banana Logo" class="logo-icon" />
        <h1 class="logo">Banana</h1>
      </RouterLink>
      <div class="user-info">
        <el-dropdown>
          <span class="user-dropdown">
            <el-avatar :size="32" :src="defaultAvatar" />
            <span class="username">{{ permissionStore.currentUser?.name || '用户' }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="showProfile">个人资料</el-dropdown-item>
              <el-dropdown-item divided :disabled="loggingOut" @click="logout">
                {{ loggingOut ? '正在退出…' : '退出登录' }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>

  <el-dialog v-model="profileDialogVisible" title="个人资料" width="600px">
    <div class="profile-content">
      <div class="profile-grid">
        <div class="profile-item">
          <span class="profile-label">用户 ID</span>
          <span class="profile-value">{{ permissionStore.currentUser?.id }}</span>
        </div>
        <div class="profile-item">
          <span class="profile-label">用户名</span>
          <span class="profile-value">{{ permissionStore.currentUser?.name }}</span>
        </div>
        <div class="profile-item">
          <span class="profile-label">邮箱</span>
          <span class="profile-value">{{ permissionStore.currentUser?.email || '未设置' }}</span>
        </div>
        <div class="profile-item">
          <span class="profile-label">手机号</span>
          <span class="profile-value">{{ permissionStore.currentUser?.phone || '未设置' }}</span>
        </div>
        <div class="profile-item full-width">
          <span class="profile-label">备注</span>
          <span class="profile-value">{{
            permissionStore.currentUser?.remark || '无备注信息'
          }}</span>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="profileDialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.admin-header {
  position: sticky;
  z-index: 20;
  top: 0;
  width: 100%;
  height: 60px !important;
  padding: 0;
  border-bottom: 1px solid var(--sidebar-divider);
  background: var(--surface);
  box-shadow: 0 2px 4px rgba(52, 66, 56, 0.08);
}

.header-content {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.brand:hover {
  background: var(--el-color-primary-light-9);
}

.logo-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.logo {
  margin: 0;
  color: var(--sidebar-brand-text);
  font-size: 20px;
  font-weight: 700;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  color: var(--el-text-color-regular);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.user-dropdown:hover {
  background: var(--el-fill-color-light);
}

.username {
  font-size: 14px;
}

.profile-content {
  padding: 20px 0;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.profile-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.profile-item.full-width {
  grid-column: 1 / -1;
}

.profile-label {
  color: var(--el-text-color-regular);
  font-size: 14px;
  font-weight: 500;
}

.profile-value {
  display: flex;
  min-height: 20px;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
  font-size: 14px;
}

.user-dropdown:focus,
.user-dropdown:focus-visible {
  outline: none;
}

@media (max-width: 520px) {
  .header-content {
    padding: 0 8px;
  }

  .brand {
    padding: 8px;
  }

  .username {
    display: none;
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }

  .profile-item.full-width {
    grid-column: auto;
  }
}
</style>
