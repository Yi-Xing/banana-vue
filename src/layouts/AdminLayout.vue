<script setup lang="ts">
import AdminHeader from '@/components/admin/AdminHeader.vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
</script>

<template>
  <el-container class="admin-shell" direction="vertical">
    <AdminHeader />
    <el-container class="admin-body">
      <AdminSidebar />
      <el-main class="admin-content"><RouterView /></el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.admin-shell {
  min-height: 100vh;
  background: var(--surface-page);
}

.admin-body {
  min-height: calc(100vh - 60px);
}

.admin-content {
  width: 100%;
  min-width: 0;
  padding: 28px;
}

@media (max-width: 760px) {
  .admin-content {
    padding: 18px 14px 84px;
  }
}
</style>
