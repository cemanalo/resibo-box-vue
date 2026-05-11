import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import ScanReceiptsPage from '../pages/ScanReceiptsPage.vue'
import AuthPage from '../pages/AuthPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomePage.vue')
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthPage,
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../pages/DashboardPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/scan-receipts',
      name: 'scan-receipts',
      component: ScanReceiptsPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('../pages/AuthCallbackPage.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../pages/ResetPasswordPage.vue'),
      meta: { requiresGuest: true }
    }
  ]
})

// Navigation guards
router.beforeEach(async (to, _from, next) => {
  const { isAuthenticated, loading, initAuth } = useAuth()
  
  // Initialize auth if not already done
  if (loading.value) {
    await initAuth()
  }
  
  // Handle routes that require authentication
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/auth')
    return
  }
  
  // Handle routes that should be accessed only by guests (not authenticated users)
  if (to.meta.requiresGuest && isAuthenticated.value) {
    next('/dashboard')
    return
  }
  
  next()
})

export default router
