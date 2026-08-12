<script setup lang="ts">
import { RouterLink } from 'vue-router'

import bananaLogo from '@/assets/banana-logo.webp'
</script>

<template>
  <div class="public-home">
    <header class="site-header">
      <div class="page-container header-inner">
        <RouterLink class="brand" to="/" aria-label="Banana 公开首页">
          <span class="brand-mark"><img :src="bananaLogo" alt="" /></span>
          <span>Banana</span>
        </RouterLink>
        <RouterLink class="dashboard-link" to="/admin/dashboard">进入仪表盘</RouterLink>
      </div>
    </header>

    <main class="page-container hero" aria-labelledby="public-home-title">
      <div class="hero-copy">
        <p class="eyebrow">Banana · 文件管理系统</p>
        <h1 id="public-home-title">文件管理，<br /><span>简单又清晰。</span></h1>
        <p class="description">
          Banana
          是一套面向团队的文件管理与对象存储系统，提供文件上传、分类整理、图片浏览、回收站和多存储配置等能力，让文件从上传、使用到清理的全生命周期都清晰可控。
        </p>
        <div class="actions">
          <RouterLink class="primary-action" to="/admin/dashboard">
            进入仪表盘
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </RouterLink>
        </div>
      </div>

      <div class="hero-visual" aria-label="Banana 文件系统插画">
        <span class="visual-label">BANANA / FILE CENTER</span>
        <div class="logo-card">
          <img :src="bananaLogo" alt="明黄色香蕉插画" />
        </div>
        <p>Upload · Organize<br />Store · Manage</p>
      </div>
    </main>

    <footer class="site-footer">
      <div class="page-container footer-inner">
        <span>Banana 文件系统</span>
        <span>File management · Object storage</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.public-home {
  display: grid;
  height: 100vh;
  height: 100dvh;
  grid-template-rows: 68px minmax(0, 1fr) 48px;
  overflow: hidden;
}

.site-header {
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: rgba(255, 254, 251, 0.92);
  backdrop-filter: blur(18px);
}

.header-inner,
.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.header-inner {
  min-height: 68px;
}

.footer-inner {
  min-height: 48px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--ink-strong);
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 800;
  text-decoration: none;
}

.brand-mark {
  display: grid;
  width: 36px;
  height: 36px;
  overflow: hidden;
  place-items: center;
  border: 1px solid rgba(228, 185, 71, 0.28);
  border-radius: 10px 4px 10px 4px;
  background: var(--banana-soft);
}

.brand-mark img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.dashboard-link,
.primary-action {
  color: var(--ink-strong);
  font-size: 14px;
  font-weight: 750;
  text-decoration: none;
}

.dashboard-link {
  border-bottom: 2px solid var(--banana);
  line-height: 30px;
}

.hero {
  display: grid;
  min-height: 0;
  grid-template-columns: minmax(0, 1.08fr) minmax(330px, 0.92fr);
  align-items: center;
  gap: clamp(40px, 7vw, 96px);
  padding-top: clamp(24px, 5vh, 48px);
  padding-bottom: clamp(24px, 5vh, 48px);
}

.eyebrow {
  color: var(--banana-deep);
  font-family: var(--font-functional);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.17em;
  text-transform: uppercase;
}

h1 {
  margin-top: 18px;
  color: var(--ink-strong);
  font-family: var(--font-display);
  font-size: clamp(50px, 6vw, 82px);
  font-weight: 800;
  letter-spacing: -0.065em;
  line-height: 1;
}

h1 span {
  color: var(--brand);
}

.description {
  max-width: 650px;
  margin-top: 24px;
  color: var(--ink-muted);
  font-size: 17px;
  line-height: 1.75;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 28px;
}

.actions a {
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 22px;
  border: 1px solid var(--line);
  border-radius: 8px 3px 8px 3px;
}

.actions .primary-action {
  border-color: var(--ink-strong);
  background: var(--ink-strong);
  color: var(--surface);
}

.primary-action svg {
  width: 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.hero-visual {
  position: relative;
  height: min(440px, calc(100dvh - 190px));
  min-height: 360px;
  padding: 30px;
  border: 1px solid rgba(88, 125, 165, 0.16);
  border-radius: 46% 54% 42% 58% / 54% 40% 60% 46%;
  background: linear-gradient(145deg, var(--banana-pale), var(--el-color-primary-light-9));
  transform: rotate(1.5deg);
}

.visual-label {
  color: var(--brand-deep);
  font-family: var(--font-functional);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.logo-card {
  display: grid;
  height: calc(100% - 54px);
  place-items: center;
}

.logo-card img {
  width: min(76%, 320px);
  filter: drop-shadow(0 24px 26px rgba(112, 91, 28, 0.14));
  transform: rotate(-7deg);
}

.hero-visual p {
  color: var(--ink-muted);
  font-family: var(--font-functional);
  font-size: 12px;
  line-height: 1.6;
  text-align: right;
  text-transform: uppercase;
}

.site-footer {
  border-top: 1px solid var(--line);
  color: var(--ink-subtle);
  font-family: var(--font-functional);
  font-size: 12px;
}

@media (max-width: 820px) {
  .public-home {
    display: block;
    height: auto;
    min-height: 100vh;
    min-height: 100dvh;
    overflow: visible;
  }

  .hero {
    grid-template-columns: 1fr;
    padding-top: 64px;
    padding-bottom: 72px;
  }

  .hero-visual {
    height: auto;
    min-height: 360px;
  }

  .logo-card {
    min-height: 250px;
  }
}

@media (max-width: 560px) {
  .header-inner,
  .footer-inner {
    min-height: 64px;
  }

  h1 {
    font-size: clamp(46px, 15vw, 68px);
  }

  .description {
    font-size: 16px;
  }

  .hero-visual {
    min-height: 300px;
    padding: 26px;
  }

  .logo-card {
    min-height: 210px;
  }

  .footer-inner {
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
