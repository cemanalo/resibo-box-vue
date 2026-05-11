<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="flex justify-center">
          <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
            </svg>
          </div>
        </div>
        <h1 class="mt-4 text-3xl font-bold text-gray-900">Reset Password</h1>
        <p class="mt-2 text-gray-600">Enter your new password</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="handleResetPassword" class="space-y-4">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your new password (min 6 characters)"
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              minlength="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm your new password"
            />
          </div>
          
          <div v-if="error" class="text-red-600 text-sm text-center">
            {{ error }}
          </div>
          
          <div v-if="success" class="text-green-600 text-sm text-center">
            {{ success }}
          </div>
          
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <router-link
            to="/auth"
            class="text-sm text-blue-600 hover:text-blue-500 focus:outline-none"
          >
            Back to Sign In
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../config/supabase'

const router = useRouter()
const route = useRoute()

const form = ref({
  password: '',
  confirmPassword: ''
})

const error = ref<string | null>(null)
const success = ref<string | null>(null)
const loading = ref(false)

const isFormValid = computed(() => {
  return form.value.password && 
         form.value.confirmPassword &&
         form.value.password === form.value.confirmPassword &&
         form.value.password.length >= 6
})

onMounted(() => {
  // Check if we have the necessary tokens in the URL
  const accessToken = route.query.access_token as string
  const refreshToken = route.query.refresh_token as string
  
  if (!accessToken || !refreshToken) {
    error.value = 'Invalid or expired reset link'
    setTimeout(() => {
      router.push('/auth')
    }, 3000)
  }
})

const handleResetPassword = async () => {
  if (!isFormValid.value) {
    error.value = 'Please fill in all fields correctly'
    return
  }
  
  loading.value = true
  error.value = null
  success.value = null
  
  try {
    const accessToken = route.query.access_token as string
    const refreshToken = route.query.refresh_token as string
    
    const { error: resetError } = await supabase.auth.updateUser({
      password: form.value.password
    })
    
    if (resetError) {
      throw resetError
    }
    
    success.value = 'Password reset successfully! Redirecting to sign in...'
    
    setTimeout(() => {
      router.push('/auth')
    }, 2000)
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to reset password'
  } finally {
    loading.value = false
  }
}
</script>
