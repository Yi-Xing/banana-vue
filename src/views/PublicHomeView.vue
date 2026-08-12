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
        <RouterLink class="workspace-link" to="/workspace">进入工作台</RouterLink>
      </div>
    </header>

    <main class="page-container hero" aria-labelledby="public-home-title">
      <div class="hero-copy">
        <p class="eyebrow">Public home · 无需登录</p>
        <h1 id="public-home-title">文件能力，<br /><span>从这里开始。</span></h1>
        <p class="description">
          这是 Banana
          的公开首页，任何人都可以直接访问。进入工作台后，系统会通过用户中心完成登录，并根据当前用户的页面、按钮和接口权限提供对应能力。
        </p>
        <div class="actions">
          <RouterLink class="primary-action" to="/workspace">
            进入工作台
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </RouterLink>
          <a class="secondary-action" href="#permission-model">了解权限模型</a>
        </div>
      </div>

      <div class="hero-visual" aria-label="Banana 文件系统插画">
        <span class="visual-label">BANANA / PUBLIC</span>
        <div class="logo-card">
          <img :src="bananaLogo" alt="明黄色香蕉插画" />
        </div>
        <p>Public landing<br />Protected workspace</p>
      </div>
    </main>

    <section id="permission-model" class="permission-section">
      <div class="page-container permission-inner">
        <div>
          <p class="eyebrow">Permission model</p>
          <h2>公开入口与受控能力清晰分开</h2>
        </div>
        <div class="permission-grid">
          <article>
            <span>01</span>
            <h3>公开首页</h3>
            <p>访问首页不会触发登录，也不依赖任何页面权限。</p>
          </article>
          <article>
            <span>02</span>
            <h3>统一登录</h3>
            <p>访问工作台时跳转 Watermelon，复用统一用户身份。</p>
          </article>
          <article>
            <span>03</span>
            <h3>动态权限</h3>
            <p>每次受保护页面跳转都会刷新权限，管理员变更可及时生效。</p>
          </article>
        </div>
      </div>
    </section>

    <footer class="site-footer">
      <div class="page-container footer-inner">
        <span>Banana 文件系统</span>
        <span>Public by default · Protected by permission</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.public-home {
  min-height: 100vh;
  overflow: hidden;
}

.site-header {
  border-bottom: 1px solid rgba(28, 36, 21, 0.08);
  background: rgba(255, 253, 244, 0.86);
  backdrop-filter: blur(18px);
}

.header-inner,
.footer-inner {
  display: flex;
  min-height: 72px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
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
  border: 1px solid rgba(52, 61, 28, 0.1);
  border-radius: 10px 4px 10px 4px;
  background: var(--banana-soft);
}

.brand-mark img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.workspace-link,
.primary-action,
.secondary-action {
  color: var(--ink-strong);
  font-size: 14px;
  font-weight: 750;
  text-decoration: none;
}

.workspace-link {
  border-bottom: 2px solid var(--banana-deep);
  line-height: 30px;
}

.hero {
  display: grid;
  min-height: calc(100vh - 72px);
  grid-template-columns: minmax(0, 1.08fr) minmax(330px, 0.92fr);
  align-items: center;
  gap: clamp(48px, 8vw, 120px);
  padding-top: 72px;
  padding-bottom: 88px;
}

.eyebrow {
  color: var(--leaf);
  font-family: var(--font-functional);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.17em;
  text-transform: uppercase;
}

h1 {
  margin-top: 22px;
  color: var(--ink-strong);
  font-family: var(--font-display);
  font-size: clamp(52px, 6.6vw, 94px);
  font-weight: 800;
  letter-spacing: -0.065em;
  line-height: 1;
}

h1 span {
  color: var(--leaf);
}

.description {
  max-width: 650px;
  margin-top: 30px;
  color: var(--ink-muted);
  font-size: 18px;
  line-height: 1.85;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 38px;
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
  min-height: 440px;
  padding: 34px;
  border: 1px solid rgba(36, 46, 28, 0.12);
  border-radius: 46% 54% 42% 58% / 54% 40% 60% 46%;
  background: linear-gradient(145deg, var(--banana-soft), rgba(244, 196, 48, 0.28));
  transform: rotate(1.5deg);
}

.visual-label {
  color: var(--leaf);
  font-family: var(--font-functional);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.logo-card {
  display: grid;
  min-height: 300px;
  place-items: center;
}

.logo-card img {
  width: min(76%, 320px);
  filter: drop-shadow(0 24px 26px rgba(94, 72, 0, 0.16));
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

.permission-section {
  padding: 104px 0;
  border-top: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.5);
}

.permission-inner h2 {
  max-width: 620px;
  margin-top: 12px;
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 52px);
  letter-spacing: -0.04em;
}

.permission-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 52px;
}

.permission-grid article {
  min-height: 210px;
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 18px 5px 18px 5px;
  background: var(--surface);
}

.permission-grid span {
  color: var(--banana-deep);
  font-family: var(--font-functional);
  font-size: 12px;
  font-weight: 800;
}

.permission-grid h3 {
  margin-top: 44px;
  font-size: 20px;
}

.permission-grid p {
  margin-top: 12px;
  color: var(--ink-muted);
  line-height: 1.7;
}

.site-footer {
  border-top: 1px solid var(--line);
  color: var(--ink-subtle);
  font-family: var(--font-functional);
  font-size: 12px;
}

@media (max-width: 820px) {
  .hero {
    grid-template-columns: 1fr;
    padding-top: 64px;
  }

  .hero-visual {
    min-height: 360px;
  }

  .permission-grid {
    grid-template-columns: 1fr;
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
