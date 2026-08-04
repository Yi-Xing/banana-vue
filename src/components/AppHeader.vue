<script setup lang="ts">
import { RouterLink } from 'vue-router'

import bananaLogo from '@/assets/banana-logo.webp'
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
        <a href="#foundation">项目基础</a>
        <a href="#structure">目录结构</a>
      </nav>

      <a class="header-action" href="#start">开始使用</a>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  z-index: 20;
  top: 0;
  border-bottom: 1px solid rgba(28, 36, 21, 0.08);
  background: rgba(255, 253, 244, 0.88);
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
  border: 1px solid rgba(52, 61, 28, 0.1);
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
  color: var(--leaf);
}

.header-action {
  justify-self: end;
  border-bottom: 2px solid var(--banana-deep);
  color: var(--ink-strong);
  font-size: 14px;
  font-weight: 700;
  line-height: 30px;
  text-decoration: none;
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
