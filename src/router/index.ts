import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/pages/Home.vue'),
    },
    {
      path: '/post/:slug',
      name: 'Post',
      component: () => import('@/pages/Post.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
