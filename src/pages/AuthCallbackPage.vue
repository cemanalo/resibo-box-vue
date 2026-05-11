<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">Completing authentication...</h2>
      <p class="text-gray-600">Please wait while we sign you in.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../config/supabase'

const router = useRouter()

onMounted(async () => {
  try {
    // Handle the OAuth callback
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Auth callback error:', error)
      router.push('/auth?error=authentication_failed')
      return
    }
    
    if (data.session) {
      router.push('/scan-receipts')
    } else {
      router.push('/auth')
    }
  } catch (error) {
    console.error('Auth callback error:', error)
    router.push('/auth?error=authentication_failed')
  }
})
</script>
