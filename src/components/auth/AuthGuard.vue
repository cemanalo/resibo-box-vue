<template>
  <div v-if="loading" class="flex items-center justify-center min-h-screen">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
  
  <div v-else-if="!isAuthenticated" class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="text-center">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Authentication Required</h1>
        <p class="text-gray-600">Please sign in to access this page</p>
      </div>
      
      <div class="space-y-4">
        <button
          @click="redirectToLogin"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Sign In
        </button>
        
        <router-link
          to="/"
          class="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-center"
        >
          Back to Home
        </router-link>
      </div>
    </div>
  </div>
  
  <slot v-else></slot>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const { isAuthenticated, loading, initAuth } = useAuth()

onMounted(async () => {
  await initAuth()
})

const redirectToLogin = () => {
  router.push('/auth')
}
</script>
