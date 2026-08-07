<template>
  <main class="forbidden-page">
    <p class="eyebrow">403</p>
    <h1>暂无页面访问权限</h1>
    <p>权限可能刚刚发生变化，请联系管理员在用户中心配置 Banana 页面权限。</p>
    <div class="actions">
      <RouterLink class="primary-action" to="/workspace">重新检查权限</RouterLink>
      <RouterLink class="secondary-action" to="/">返回公开首页</RouterLink>
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.forbidden-page {
  display: grid;
  min-height: 70vh;
  place-content: center;
  padding: 32px;
  text-align: center;
}

.eyebrow {
  margin: 0;
  color: var(--banana-deep);
  font-weight: 800;
  letter-spacing: 0.12em;
}

h1 {
  margin: 10px 0;
  color: var(--ink-strong);
}

p:last-child {
  max-width: 560px;
  color: var(--ink-muted);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
}

.actions a {
  min-height: 44px;
  padding: 11px 18px;
  border: 1px solid var(--line);
  border-radius: 8px 3px 8px 3px;
  color: var(--ink-strong);
  font-weight: 700;
  text-decoration: none;
}

.actions .primary-action {
  border-color: var(--ink-strong);
  background: var(--ink-strong);
  color: var(--surface);
}
</style>
