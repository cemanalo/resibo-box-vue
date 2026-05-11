<template>
  <div class="w-full max-w-md mx-auto">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Sign In</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            placeholder="Enter your email"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            placeholder="Enter your password"
          />
        </div>
        
        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
      
      <!-- <div class="mt-4">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <button
          @click="handleGoogleSignIn"
          :disabled="loading"
          class="mt-3 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div> -->
      
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <button
            @click="$emit('switchToRegister')"
            class="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
          >
            Sign up
          </button>
        </p>
        
        <button
          @click="$emit('forgotPassword')"
          class="mt-2 text-sm text-blue-600 hover:text-blue-500 focus:outline-none"
        >
          Forgot your password?
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'

const emit = defineEmits<{
  switchToRegister: []
  forgotPassword: []
  loginSuccess: []
}>()

const { signIn, loading } = useAuth()

const form = ref({
  email: '',
  password: ''
})

const error = ref<string | null>(null)

const handleLogin = async () => {
  error.value = null
  
  const result = await signIn(form.value.email, form.value.password)
  
  if (result.success) {
    emit('loginSuccess')
  } else {
    error.value = result.error || null
  }
}

// const handleGoogleSignIn = async () => {
//   error.value = null
  
//   const result = await signInWithGoogle()
  
//   if (!result.success) {
//     error.value = result.error || null
//   }
// }
</script>
