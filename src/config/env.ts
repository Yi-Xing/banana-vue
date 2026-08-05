interface EnvConfig {
  apiBaseUrl: string
}

function normalizeBaseUrl(value: string | undefined): string {
  return value?.trim().replace(/\/$/, '') ?? ''
}

export const envConfig: EnvConfig = {
  apiBaseUrl: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL),
}
