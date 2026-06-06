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
      path: '/articles',
      name: 'Articles',
      component: () => import('@/pages/Articles.vue'),
    },
    {
      path: '/courses',
      name: 'Courses',
      component: () => import('@/pages/Courses.vue'),
    },
    {
      path: '/photography',
      name: 'Photography',
      component: () => import('@/pages/Photography.vue'),
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
