<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeftBold,
  ArrowRightBold,
  Box,
  CollectionTag,
  DataBoard,
  Delete,
  Files,
  Picture,
} from '@element-plus/icons-vue'

import { PAGE_PERMISSIONS } from '@/constants/permissionCode'
import { usePermissionStore } from '@/stores/permission'

const route = useRoute()
const permissions = usePermissionStore()
const isCollapsed = ref(false)
const active = computed(() => route.path)
const menus = [
  {
    path: '/admin/dashboard',
    label: '仪表盘',
    icon: DataBoard,
    permission: PAGE_PERMISSIONS.ADMIN_DASHBOARD,
  },
  { path: '/admin/files', label: '文件管理', icon: Files, permission: PAGE_PERMISSIONS.ADMIN_FILE },
  {
    path: '/admin/images',
    label: '图片视图',
    icon: Picture,
    permission: PAGE_PERMISSIONS.ADMIN_IMAGE,
  },
  {
    path: '/admin/categories',
    label: '分类管理',
    icon: CollectionTag,
    permission: PAGE_PERMISSIONS.ADMIN_CATEGORY,
  },
  { path: '/admin/oss', label: 'OSS 管理', icon: Box, permission: PAGE_PERMISSIONS.ADMIN_OSS },
  {
    path: '/admin/recycle-bin',
    label: '回收站',
    icon: Delete,
    permission: PAGE_PERMISSIONS.ADMIN_RECYCLE,
  },
]
const visibleMenus = computed(() =>
  menus.filter((item) => permissions.hasPagePermission(item.permission)),
)
function toggleCollapse(): void {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <el-aside
    class="sidebar"
    :class="{ 'is-collapsed': isCollapsed }"
    :width="isCollapsed ? '64px' : '250px'"
  >
    <button
      class="collapse-button"
      type="button"
      :aria-label="isCollapsed ? '展开导航' : '收起导航'"
      @click="toggleCollapse"
    >
      <el-icon><ArrowRightBold v-if="isCollapsed" /><ArrowLeftBold v-else /></el-icon>
    </button>
    <el-menu :default-active="active" router :collapse="isCollapsed" :collapse-transition="false">
      <el-menu-item v-for="menu in visibleMenus" :key="menu.path" :index="menu.path">
        <el-icon><component :is="menu.icon" /></el-icon>
        <span>{{ menu.label }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: 60px;
  height: calc(100vh - 60px);
  overflow: hidden;
  border-right: 1px solid var(--el-border-color-light);
  background: #fff;
  transition: width 0.3s ease;
}

.el-menu {
  height: 100%;
  border-right: 0;
}

.el-menu-item {
  color: var(--ink-muted);
}

.el-menu-item.is-active {
  background: transparent;
  color: var(--el-color-primary);
}

.el-menu-item .el-icon {
  color: inherit;
}

.collapse-button {
  position: absolute;
  z-index: 10;
  top: 20px;
  right: -12px;
  display: flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--el-border-color);
  border-radius: 50%;
  background: #fff;
  color: var(--ink-muted);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.collapse-button:hover {
  border-color: var(--el-border-color-dark);
  background: var(--el-fill-color-light);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.collapse-button:focus,
.collapse-button:focus-visible {
  outline: none;
}

.sidebar.is-collapsed .collapse-button {
  right: -12px;
}

@media (max-width: 760px) {
  .sidebar {
    position: fixed;
    z-index: 30;
    top: auto;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100% !important;
    height: 70px;
    border-top: 1px solid var(--el-border-color-lighter);
    border-right: 0;
  }

  .el-menu {
    display: flex;
    width: 100% !important;
    height: 100%;
    padding: 5px 6px;
    overflow-x: auto;
  }

  .el-menu-item {
    min-width: 68px;
    height: 60px;
    flex-direction: column;
    justify-content: center;
    gap: 3px;
    margin: 0 2px;
    padding: 5px 10px;
    font-size: 11px;
  }

  .el-menu-item.is-active {
    background: var(--el-color-primary-light-9);
  }

  .el-menu-item .el-icon {
    margin-right: 0;
  }

  .collapse-button {
    display: none;
  }
}
</style>
