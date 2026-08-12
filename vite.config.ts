import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.BANANA_DEV_PORT || 5173),
      allowedHosts: ['banana.fblue.top'],
      proxy: {
        '/api': {
          target: env.BANANA_API_PROXY_TARGET || 'http://banana.fblue.top:8081',
          changeOrigin: true,
        },
        '/local-files': {
          target: env.BANANA_API_PROXY_TARGET || 'http://banana.fblue.top:8081',
          changeOrigin: true,
        },
      },
    },
  }
})
