import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { SSO_SESSION_STORAGE_KEY } from '@/constants/storage'
import type { SsoTokenData, StoredSsoSession } from '@/types/auth'

function readStoredSession(): StoredSsoSession | null {
  const value = localStorage.getItem(SSO_SESSION_STORAGE_KEY)
  if (!value) return null

  try {
    const session = JSON.parse(value) as Partial<StoredSsoSession>
    if (
      typeof session.accessToken !== 'string' ||
      typeof session.expiresAt !== 'number' ||
      session.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      localStorage.removeItem(SSO_SESSION_STORAGE_KEY)
      return null
    }

    return {
      accessToken: session.accessToken,
      expiresAt: session.expiresAt,
    }
  } catch {
    localStorage.removeItem(SSO_SESSION_STORAGE_KEY)
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const initialSession = readStoredSession()
  const accessToken = ref<string | null>(initialSession?.accessToken ?? null)
  const expiresAt = ref<number | null>(initialSession?.expiresAt ?? null)

  const isLoggedIn = computed(
    () =>
      Boolean(accessToken.value) &&
      typeof expiresAt.value === 'number' &&
      expiresAt.value > Math.floor(Date.now() / 1000),
  )

  function setSession(data: SsoTokenData): void {
    accessToken.value = data.accessToken
    expiresAt.value = data.expiresAt
    localStorage.setItem(
      SSO_SESSION_STORAGE_KEY,
      JSON.stringify({ accessToken: data.accessToken, expiresAt: data.expiresAt }),
    )
  }

  function clearSession(): void {
    accessToken.value = null
    expiresAt.value = null
    localStorage.removeItem(SSO_SESSION_STORAGE_KEY)
  }

  function getValidAccessToken(): string | null {
    if (!isLoggedIn.value) {
      clearSession()
      return null
    }
    return accessToken.value
  }

  return {
    accessToken,
    expiresAt,
    isLoggedIn,
    setSession,
    clearSession,
    getValidAccessToken,
  }
})
