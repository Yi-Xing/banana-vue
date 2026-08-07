import type { App } from 'vue'

import { permission } from '@/directives/permission'

export function registerDirectives(app: App): void {
  app.directive('permission', permission)
}
