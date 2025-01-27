import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'Home',
    //   component: () => import('../components/pages/Home/index.vue'),
    // },
    {
      path: '/customers',
      name: 'Customer',
      component: () => import('../components/pages/Customers/index.vue'),
    },
    {
      path: '/orders',
      name: 'Orders',
      component: () => import('../components/pages/Orders/index.vue'),
    },
    {
      path: '/storage',
      name: 'Storage',
      component: () => import('../components/pages/Storage/index.vue'),
    },
    {
      path: '/trash',
      name: 'Trash',
      component: () => import('../components/pages/Trash/index.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../components/pages/Login/index.vue'),
    },
  ],
})

export default router
