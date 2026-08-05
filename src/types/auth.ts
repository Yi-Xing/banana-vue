export interface SsoTokenData {
  accessToken: string
  tokenType: string
  expiresAt: number
  returnPath: string
}

export interface StoredSsoSession {
  accessToken: string
  expiresAt: number
}
