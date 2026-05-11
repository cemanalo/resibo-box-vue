import { ref, computed, readonly } from 'vue'
import type { User } from '@supabase/supabase-js'
import { authService } from '../services/auth.service'

const user = ref<User | null>(null)
const loading = ref(true)

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value)
  const userEmail = computed(() => user.value?.email)
  const userName = computed(() => user.value?.user_metadata?.name || user.value?.email)

  const initAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      user.value = currentUser
    } catch (error) {
      console.error('Error initializing auth:', error)
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email: string, password: string) => {
    loading.value = true
    try {
      const { user: authUser, error } = await authService.signIn({ email, password })
      
      if (error) {
        throw error
      }
      
      user.value = authUser
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      }
    } finally {
      loading.value = false
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    loading.value = true
    try {
      const { user: authUser, error } = await authService.signUp({ email, password, name })
      
      if (error) {
        throw error
      }
      
      user.value = authUser
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      }
    } finally {
      loading.value = false
    }
  }

  const signInWithGoogle = async () => {
    loading.value = true
    try {
      const { error } = await authService.signInWithGoogle()
      
      if (error) {
        throw error
      }
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Google sign-in failed' 
      }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    try {
      const { error } = await authService.signOut()
      
      if (error) {
        throw error
      }
      
      user.value = null
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Sign out failed' 
      }
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await authService.resetPassword(email)
      
      if (error) {
        throw error
      }
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password reset failed' 
      }
    }
  }

  // Set up auth state listener
  authService.onAuthStateChange((authUser: User | null) => {
    user.value = authUser
  })

  return {
    user: readonly(user),
    loading: readonly(loading),
    isAuthenticated,
    userEmail,
    userName,
    initAuth,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword
  }
}
