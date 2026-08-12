<script setup lang="ts">
import AdminHeader from '@/components/admin/AdminHeader.vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
</script>

<template>
  <div class="admin-shell">
    <AdminHeader />
    <div class="admin-body">
      <AdminSidebar />
      <main class="admin-content"><RouterView /></main>
    </div>
  </div>
</template>

<style scoped>
.admin-shell {
  min-height: 100vh;
  background: #f4f6f1;
}
.admin-body {
  display: flex;
  min-height: calc(100vh - 64px);
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
