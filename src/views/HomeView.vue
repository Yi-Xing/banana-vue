<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import bananaLogo from '@/assets/banana-logo.webp'

const foundations = [
  {
    name: 'Vue 3',
    description: '使用 Composition API 和 TypeScript，保持组件清晰、类型可靠。',
    code: '01',
  },
  {
    name: '工程工具',
    description: 'Vite、ESLint 与 Prettier 已配置，可直接进入日常开发。',
    code: '02',
  },
  {
    name: '应用基础',
    description: '集成 Router、Pinia 与 Element Plus，为后续扩展留出标准入口。',
    code: '03',
  },
]

const projectTree = [
  ['src/components', '通用组件'],
  ['src/router', '页面路由'],
  ['src/stores', '状态管理'],
  ['src/styles', '全局样式'],
  ['src/views', '页面视图'],
]
</script>

<template>
  <div class="home-page">
    <AppHeader />

    <main>
      <section class="hero page-container" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow">A clean Vue starter</p>
          <h1 id="hero-title">把想法剥到最简单，<br /><span>留下一个好起点。</span></h1>
          <p class="hero-description">
            Banana Vue
            保留现代前端项目真正需要的骨架。没有业务包袱，只有一个清晰首页和可持续扩展的工程基础。
          </p>

          <div id="start" class="hero-actions">
            <a class="button button-primary" href="#foundation">
              浏览项目基础
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a class="button button-secondary" href="#structure">查看目录结构</a>
          </div>

          <div class="stack-line" aria-label="项目技术栈">
            <span>Vue 3</span>
            <span>TypeScript</span>
            <span>Vite</span>
          </div>
        </div>

        <div class="hero-visual" aria-label="Banana Vue 品牌插画">
          <div class="orbit orbit-large"></div>
          <div class="orbit orbit-small"></div>
          <div class="visual-card">
            <span class="visual-index">B / 01</span>
            <img :src="bananaLogo" alt="明黄色香蕉插画" />
            <span class="visual-status">Ready to build</span>
          </div>
          <span class="visual-note">Fresh project · clean code</span>
        </div>
      </section>

      <section id="foundation" class="foundation-section">
        <div class="page-container">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Project foundation</p>
              <h2>只保留必要的能力</h2>
            </div>
            <p>首页之外没有登录、权限、接口或管理后台。工程边界干净，下一步由真实需求决定。</p>
          </div>

          <div class="foundation-grid">
            <article v-for="item in foundations" :key="item.name" class="foundation-card">
              <span class="card-index">{{ item.code }}</span>
              <div>
                <h3>{{ item.name }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="structure" class="structure-section page-container">
        <div class="structure-copy">
          <p class="eyebrow">Simple structure</p>
          <h2>结构先清楚，功能再生长</h2>
          <p>
            目录按职责拆分，入口、路由和样式均已接好。需要新增页面或状态时，可在对应位置自然扩展。
          </p>
          <span class="structure-caption">banana-vue / version 0.0.0</span>
        </div>

        <div class="project-tree" aria-label="Banana Vue 项目目录">
          <div class="tree-header">
            <span>banana-vue</span>
            <span>src</span>
          </div>
          <ul>
            <li v-for="([path, label], index) in projectTree" :key="path">
              <span class="tree-number">{{ String(index + 1).padStart(2, '0') }}</span>
              <code>{{ path }}</code>
              <span>{{ label }}</span>
            </li>
          </ul>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="page-container footer-inner">
        <p>Banana Vue</p>
        <p>Vue 3 · TypeScript · Vite</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  overflow: hidden;
}

.hero {
  display: grid;
  min-height: calc(100vh - 72px);
  grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
  align-items: center;
  gap: clamp(48px, 7vw, 112px);
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

.hero h1 {
  max-width: 760px;
  margin-top: 22px;
  color: var(--ink-strong);
  font-family: var(--font-display);
  font-size: clamp(48px, 5.7vw, 84px);
  font-weight: 800;
  letter-spacing: -0.065em;
  line-height: 1.03;
  text-wrap: balance;
}

.hero h1 span {
  position: relative;
  color: var(--leaf);
  white-space: nowrap;
}

.hero h1 span::after {
  position: absolute;
  right: 0;
  bottom: 0.04em;
  left: 0;
  z-index: -1;
  height: 0.18em;
  border-radius: 100%;
  background: var(--banana);
  content: '';
  transform: rotate(-1deg);
}

.hero-description {
  max-width: 620px;
  margin-top: 30px;
  color: var(--ink-muted);
  font-size: 18px;
  line-height: 1.85;
  text-wrap: pretty;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 38px;
}

.button {
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 22px;
  border: 1px solid transparent;
  border-radius: 8px 3px 8px 3px;
  font-size: 15px;
  font-weight: 750;
  text-decoration: none;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    background-color 180ms ease;
}

.button:hover {
  transform: translateY(-2px);
}

.button svg {
  width: 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.button-primary {
  background: var(--ink-strong);
  box-shadow: 0 12px 28px rgba(25, 33, 18, 0.14);
  color: #fffdf4;
}

.button-primary:hover {
  box-shadow: 0 16px 32px rgba(25, 33, 18, 0.2);
}

.button-secondary {
  border-color: var(--line);
  background: rgba(255, 255, 255, 0.58);
  color: var(--ink-strong);
}

.stack-line {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  margin-top: 42px;
  color: var(--ink-subtle);
  font-family: var(--font-functional);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.stack-line span {
  position: relative;
}

.stack-line span:not(:last-child)::after {
  position: absolute;
  top: 50%;
  right: -13px;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--banana-deep);
  content: '';
}

.hero-visual {
  position: relative;
  display: grid;
  min-height: 560px;
  place-items: center;
}

.orbit {
  position: absolute;
  border: 1px solid rgba(85, 101, 47, 0.18);
  border-radius: 50%;
}

.orbit-large {
  width: min(42vw, 540px);
  height: min(42vw, 540px);
  border-right-color: var(--banana-deep);
  border-right-width: 3px;
  transform: rotate(-24deg);
}

.orbit-small {
  width: min(33vw, 410px);
  height: min(33vw, 410px);
  border-top-color: var(--leaf);
  border-top-width: 2px;
  transform: rotate(34deg);
}

.visual-card {
  position: relative;
  display: grid;
  width: min(32vw, 420px);
  aspect-ratio: 0.82;
  overflow: hidden;
  place-items: center;
  border: 1px solid rgba(82, 93, 42, 0.14);
  border-radius: 34% 8% 34% 8%;
  background:
    linear-gradient(rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.08)), var(--banana-soft);
  box-shadow: 0 36px 80px rgba(73, 82, 33, 0.16);
  transform: rotate(3deg);
}

.visual-card::before {
  position: absolute;
  inset: 24px;
  border: 1px solid rgba(46, 61, 24, 0.1);
  border-radius: inherit;
  content: '';
}

.visual-card img {
  z-index: 1;
  width: 88%;
  filter: drop-shadow(0 26px 22px rgba(104, 88, 0, 0.2));
  transform: rotate(-3deg);
}

.visual-index,
.visual-status {
  position: absolute;
  z-index: 2;
  font-family: var(--font-functional);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.visual-index {
  top: 32px;
  left: 36px;
  color: var(--ink-subtle);
}

.visual-status {
  right: 36px;
  bottom: 32px;
  padding: 8px 10px;
  border-radius: 5px 2px 5px 2px;
  background: var(--ink-strong);
  color: var(--banana-soft);
}

.visual-note {
  position: absolute;
  right: -10px;
  bottom: 72px;
  padding: 12px 16px;
  border: 1px solid var(--line);
  background: var(--surface);
  box-shadow: 0 16px 34px rgba(25, 33, 18, 0.09);
  color: var(--ink-muted);
  font-family: var(--font-functional);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transform: rotate(-3deg);
}

.foundation-section {
  padding: 112px 0;
  background: var(--ink-strong);
  color: #fffdf4;
}

.section-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 0.7fr);
  align-items: end;
  gap: 64px;
}

.section-heading .eyebrow {
  color: var(--banana);
}

.section-heading h2,
.structure-copy h2 {
  margin-top: 16px;
  font-family: var(--font-display);
  font-size: clamp(36px, 4vw, 58px);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.08;
}

.section-heading > p {
  color: rgba(255, 253, 244, 0.64);
  font-size: 16px;
  line-height: 1.8;
}

.foundation-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  margin-top: 64px;
  border: 1px solid rgba(255, 253, 244, 0.14);
  background: rgba(255, 253, 244, 0.14);
}

.foundation-card {
  display: flex;
  min-height: 260px;
  flex-direction: column;
  justify-content: space-between;
  padding: 30px;
  background: var(--ink-strong);
  transition: background-color 200ms ease;
}

.foundation-card:hover {
  background: #232c1c;
}

.card-index {
  color: var(--banana);
  font-family: var(--font-functional);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.foundation-card h3 {
  margin-bottom: 14px;
  font-family: var(--font-display);
  font-size: 26px;
  letter-spacing: -0.025em;
}

.foundation-card p {
  color: rgba(255, 253, 244, 0.6);
  font-size: 15px;
  line-height: 1.75;
}

.structure-section {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(420px, 1.18fr);
  align-items: center;
  gap: clamp(64px, 9vw, 140px);
  padding-top: 120px;
  padding-bottom: 120px;
}

.structure-copy h2 {
  max-width: 540px;
  color: var(--ink-strong);
}

.structure-copy > p:not(.eyebrow) {
  max-width: 520px;
  margin-top: 26px;
  color: var(--ink-muted);
  font-size: 17px;
  line-height: 1.85;
}

.structure-caption {
  display: block;
  margin-top: 34px;
  color: var(--ink-subtle);
  font-family: var(--font-functional);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.project-tree {
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.58);
  box-shadow: 18px 18px 0 var(--banana-soft);
}

.tree-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 19px 22px;
  border-bottom: 1px solid var(--line);
  color: var(--ink-subtle);
  font-family: var(--font-functional);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.project-tree ul {
  list-style: none;
}

.project-tree li {
  display: grid;
  grid-template-columns: 36px 1fr auto;
  align-items: center;
  gap: 18px;
  min-height: 72px;
  padding: 0 22px;
  border-bottom: 1px solid var(--line);
}

.project-tree li:last-child {
  border-bottom: 0;
}

.tree-number {
  color: var(--banana-deep);
  font-family: var(--font-functional);
  font-size: 11px;
  font-weight: 800;
}

.project-tree code {
  color: var(--ink-strong);
  font-family: var(--font-functional);
  font-size: 14px;
  font-weight: 700;
}

.project-tree li > span:last-child {
  color: var(--ink-subtle);
  font-size: 13px;
}

.site-footer {
  border-top: 1px solid var(--line);
}

.footer-inner {
  display: flex;
  min-height: 92px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  color: var(--ink-subtle);
  font-family: var(--font-functional);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

@media (max-width: 980px) {
  .hero {
    min-height: auto;
    grid-template-columns: 1fr;
    padding-top: 80px;
  }

  .hero-copy {
    max-width: 760px;
  }

  .hero-visual {
    min-height: 500px;
  }

  .orbit-large {
    width: 500px;
    height: 500px;
  }

  .orbit-small {
    width: 390px;
    height: 390px;
  }

  .visual-card {
    width: 390px;
  }

  .visual-note {
    right: calc(50% - 260px);
  }

  .section-heading,
  .structure-section {
    grid-template-columns: 1fr;
  }

  .structure-section {
    gap: 54px;
  }
}

@media (max-width: 720px) {
  .hero {
    min-height: auto;
    padding-top: 64px;
    padding-bottom: 64px;
  }

  .hero h1 {
    font-size: clamp(42px, 13vw, 64px);
  }

  .hero h1 br {
    display: none;
  }

  .hero h1 span {
    white-space: normal;
  }

  .hero-description {
    font-size: 16px;
  }

  .hero-visual {
    min-height: 420px;
  }

  .orbit-large {
    width: 390px;
    height: 390px;
  }

  .orbit-small {
    width: 310px;
    height: 310px;
  }

  .visual-card {
    width: min(78vw, 330px);
  }

  .visual-note {
    right: 0;
    bottom: 30px;
  }

  .foundation-section {
    padding: 84px 0;
  }

  .section-heading {
    gap: 28px;
  }

  .foundation-grid {
    grid-template-columns: 1fr;
    margin-top: 44px;
  }

  .foundation-card {
    min-height: 210px;
  }

  .structure-section {
    padding-top: 84px;
    padding-bottom: 92px;
  }

  .project-tree {
    box-shadow: 10px 10px 0 var(--banana-soft);
  }

  .project-tree li {
    grid-template-columns: 28px 1fr;
    gap: 12px;
  }

  .project-tree li > span:last-child {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero-actions {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }

  .hero-visual {
    min-height: 360px;
  }

  .orbit-large {
    width: 330px;
    height: 330px;
  }

  .orbit-small {
    width: 260px;
    height: 260px;
  }

  .visual-card {
    width: 260px;
  }

  .visual-note {
    display: none;
  }

  .footer-inner {
    flex-direction: column;
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .button,
  .foundation-card {
    transition: none;
  }
}
</style>
