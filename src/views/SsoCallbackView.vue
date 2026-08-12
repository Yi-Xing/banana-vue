<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import bananaLogo from '@/assets/banana-logo.webp'
import { beginSsoLogin, completeSsoLogin } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const errorMessage = ref('')
const isLoading = computed(() => !errorMessage.value)

function getQueryValue(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function normalizeReturnPath(returnPath: string): string {
  return returnPath.startsWith('/') && !returnPath.startsWith('//') ? returnPath : '/'
}

async function handleCallback(): Promise<void> {
  const code = getQueryValue(route.query.code)
  const state = getQueryValue(route.query.state)

  if (!code || !state) {
    errorMessage.value = '登录回调参数不完整，请重新登录。'
    return
  }

  try {
    const session = await completeSsoLogin(code, state)
    authStore.setSession(session)
    await router.replace(normalizeReturnPath(session.returnPath))
  } catch (error) {
    authStore.clearSession()
    errorMessage.value = error instanceof Error ? error.message : 'SSO 登录失败，请重新登录。'
  }
}

function retryLogin(): void {
  beginSsoLogin('/')
}

onMounted(handleCallback)
</script>

<template>
  <main class="callback-page">
    <section class="callback-card" aria-live="polite">
      <img :src="bananaLogo" alt="" />
      <template v-if="isLoading">
        <span class="spinner" aria-hidden="true"></span>
        <h1>正在完成登录</h1>
        <p>正在安全地换取 Banana 登录凭证，请稍候。</p>
      </template>
      <template v-else>
        <h1>登录没有完成</h1>
        <p>{{ errorMessage }}</p>
        <button type="button" @click="retryLogin">重新登录</button>
      </template>
    </section>
  </main>
</template>

<style scoped>
.callback-page {
  display: grid;
  min-height: 100vh;
  padding: 24px;
  place-items: center;
}

.callback-card {
  display: flex;
  width: min(440px, 100%);
  min-height: 330px;
  align-items: center;
  justify-content: center;
  padding: 48px;
  border: 1px solid var(--line);
  border-radius: 24px 8px 24px 8px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 24px 70px rgba(25, 33, 18, 0.12);
  text-align: center;
  flex-direction: column;
}

.callback-card img {
  width: 72px;
  height: 72px;
  margin-bottom: 24px;
  object-fit: contain;
}

.callback-card h1 {
  margin-top: 18px;
  font-family: var(--font-display);
  font-size: 28px;
}

.callback-card p {
  margin-top: 12px;
  color: var(--ink-muted);
  line-height: 1.7;
}

.callback-card button {
  min-height: 44px;
  margin-top: 26px;
  padding: 0 24px;
  border: 0;
  border-radius: 8px 3px 8px 3px;
  background: var(--ink-strong);
  color: white;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(63, 104, 28, 0.18);
  border-top-color: var(--brand);
  border-radius: 50%;
  animation: spin 800ms linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation-duration: 1600ms;
  }
}
</style>
