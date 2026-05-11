<template>
  <div class="min-h-screen bg-slate-950 text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <router-link to="/" class="hover:opacity-80 transition-opacity inline-block">
          <h1 class="text-3xl font-bold text-white">Resibo Box</h1>
        </router-link>
        <p class="mt-2 text-slate-400">Turn your receipts into organized records, effortlessly.</p>
      </div>

      <!-- Auth Forms -->
      <div v-if="currentView === 'login'">
        <LoginForm 
          @switch-to-register="currentView = 'register'"
          @forgot-password="showForgotPassword = true"
          @login-success="handleAuthSuccess"
        />
      </div>
      
      <div v-else-if="currentView === 'register'">
        <RegisterForm 
          @switch-to-login="currentView = 'login'"
          @register-success="handleRegisterSuccess"
        />
      </div>
      
      <!-- Forgot Password Modal -->
      <div v-if="showForgotPassword" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-slate-900 border border-slate-800 rounded-lg p-6 w-full max-w-sm shadow-2xl backdrop-blur">
          <h3 class="text-lg font-medium text-white mb-4">Reset Password</h3>
          
          <form @submit.prevent="handleForgotPassword" class="space-y-4">
            <div>
              <label for="resetEmail" class="block text-sm font-medium text-slate-300 mb-1">
                Email
              </label>
              <input
                id="resetEmail"
                v-model="resetEmail"
                type="email"
                required
                class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            
            <div v-if="resetError" class="text-red-400 text-sm">
              {{ resetError }}
            </div>
            
            <div v-if="resetSuccess" class="text-green-400 text-sm">
              {{ resetSuccess }}
            </div>
            
            <div class="flex space-x-3">
              <button
                type="submit"
                :disabled="resetLoading"
                class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ resetLoading ? 'Sending...' : 'Send Reset Email' }}
              </button>
              
              <button
                type="button"
                @click="closeForgotPassword"
                class="flex-1 bg-slate-800 text-slate-300 py-2 px-4 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import LoginForm from '../components/auth/LoginForm.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'

const router = useRouter()
const { resetPassword } = useAuth()

const currentView = ref<'login' | 'register'>('login')
const showForgotPassword = ref(false)
const resetEmail = ref('')
const resetError = ref<string | null>(null)
const resetSuccess = ref<string | null>(null)
const resetLoading = ref(false)

const handleAuthSuccess = () => {
  router.push('/dashboard')
}

const handleRegisterSuccess = () => {
  // Show success message and switch to login after a delay
  setTimeout(() => {
    currentView.value = 'login'
  }, 3000)
}

const handleForgotPassword = async () => {
  resetError.value = null
  resetSuccess.value = null
  resetLoading.value = true
  
  const result = await resetPassword(resetEmail.value)
  
  if (result.success) {
    resetSuccess.value = 'Password reset email sent! Please check your inbox.'
    setTimeout(() => {
      closeForgotPassword()
    }, 2000)
  } else {
    resetError.value = result.error || null
  }
  
  resetLoading.value = false
}

const closeForgotPassword = () => {
  showForgotPassword.value = false
  resetEmail.value = ''
  resetError.value = null
  resetSuccess.value = null
}
</script>
