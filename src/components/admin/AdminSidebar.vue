<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { DataBoard, Files, Picture, Box, Delete, CollectionTag } from '@element-plus/icons-vue'

import { PAGE_PERMISSIONS } from '@/constants/permissionCode'
import { usePermissionStore } from '@/stores/permission'

const route = useRoute()
const permissions = usePermissionStore()
const active = computed(() => route.path)
const menus = [
  { path: '/workspace', label: '工作台', icon: DataBoard, permission: PAGE_PERMISSIONS.DASHBOARD },
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
</script>

<template>
  <aside class="sidebar">
    <nav>
      <RouterLink
        v-for="menu in menus.filter((item) => permissions.hasPagePermission(item.permission))"
        :key="menu.path"
        :to="menu.path"
        :class="{ active: active === menu.path }"
      >
        <el-icon><component :is="menu.icon" /></el-icon><span>{{ menu.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: 64px;
  width: 220px;
  height: calc(100vh - 64px);
  flex: 0 0 220px;
  border-right: 1px solid #e5e9df;
  background: #fff;
}
nav {
  display: grid;
  gap: 6px;
  padding: 20px 12px;
}
a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  color: #646b60;
  text-decoration: none;
  transition: 0.16s ease;
}
a:hover {
  background: #f5f7f1;
  color: #294d17;
}
a.active {
  background: #edf4e7;
  color: #315b1c;
  font-weight: 700;
}
@media (max-width: 760px) {
  .sidebar {
    position: fixed;
    z-index: 30;
    top: auto;
    right: 0;
    bottom: 0;
    left: 0;
    width: auto;
    height: 68px;
    border-top: 1px solid #e5e9df;
    border-right: 0;
  }
  nav {
    display: flex;
    height: 100%;
    justify-content: space-around;
    padding: 6px;
    overflow-x: auto;
  }
  a {
    min-width: 62px;
    flex-direction: column;
    gap: 2px;
    padding: 6px;
    font-size: 11px;
  }
}
</style>
