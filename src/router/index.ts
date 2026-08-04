import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
  ],
  scrollBehavior: (to) => {
    if (to.hash) {
      return { el: to.hash, top: 72 }
    }

    return { top: 0 }
  },
})

export default router
