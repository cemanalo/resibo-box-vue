<template>
  <header
    class="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl backdrop-blur sm:p-6">
    <!-- Main header row -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex-1 flex items-center gap-3">
        <!-- Mobile burger menu button -->
        <button
          v-if="isAuthenticated"
          @click="toggleMobileMenu"
          class="sm:hidden relative h-10 w-10 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 bg-slate-700 hover:bg-slate-600"
          title="Menu"
        >
          <svg class="h-5 w-5 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        
        <router-link to="/" class="hover:opacity-80 transition-opacity">
          <h1 class="text-xl font-bold tracking-tight sm:text-3xl">ResiboBox</h1>
          <p class="mt-1 text-xs text-slate-400 sm:mt-2 sm:text-sm">
            {{ subtitle }}
          </p>
        </router-link>
      </div>
      
      <!-- Navigation and user controls -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <!-- Navigation tabs (only show when authenticated) -->
        <div v-if="isAuthenticated" class="flex gap-1 rounded-lg bg-slate-800/50 p-1">
          <router-link
            to="/dashboard"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
            :class="$route.name === 'dashboard' 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'"
          >
            Dashboard
          </router-link>
          <router-link
            to="/scan-receipts"
            class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
            :class="$route.name === 'scan-receipts' 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'"
          >
            Scan
          </router-link>
        </div>
        
        <!-- Credits and user info -->
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <!-- Available Credits (only show when authenticated) -->
          <div v-if="isAuthenticated && showCredits" class="flex items-center gap-2 rounded-lg bg-slate-800/50 px-3 py-2">
            <div class="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500/20 border border-yellow-500/30">
              <span v-if="!creditsLoading" class="text-xs font-bold text-yellow-400">C</span>
              <div v-else class="animate-spin rounded-full h-3 w-3 border-2 border-yellow-400 border-t-transparent"></div>
            </div>
            <div>
              <p v-if="!creditsLoading" class="text-sm font-semibold text-green-400">{{ credits }}</p>
              <p v-else class="text-sm font-semibold text-slate-400">Loading...</p>
            </div>
          </div>
          
          <!-- User info and sign out (only show when authenticated) -->
          <div v-if="isAuthenticated" class="flex items-center gap-3">
            <!-- Desktop user info -->
            <div class="text-right hidden sm:block">
              <p class="text-sm font-medium text-white">{{ userName }}</p>
              <p class="text-xs text-slate-400">{{ userEmail }}</p>
            </div>
            
            <!-- Desktop sign out button -->
            <button
              @click="handleSignOut"
              :disabled="loading"
              class="hidden sm:block relative h-10 w-10 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="loading ? 'bg-slate-600' : 'bg-red-600 hover:bg-red-700'"
              title="Sign Out"
            >
              <svg v-if="!loading" class="h-5 w-5 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <div v-else class="h-5 w-5 flex items-center justify-center">
                <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile user info (shown only on small screens when authenticated) -->
    <div v-if="isAuthenticated" class="flex justify-between items-center pt-2 border-t border-slate-800 sm:hidden">
      <div>
        <p class="text-sm font-medium text-white">{{ userName }}</p>
        <p class="text-xs text-slate-400">{{ userEmail }}</p>
      </div>
    </div>
  </header>

  <!-- Mobile Menu Dropdown -->
  <div
    v-if="isAuthenticated && showMobileMenu"
    class="fixed inset-0 z-50 sm:hidden"
    @click="closeMobileMenu"
  >
    <div
      class="absolute right-4 top-4 w-64 rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-2xl backdrop-blur"
      @click.stop
    >
      <div class="mb-4">
        <p class="text-sm font-medium text-white mb-1">{{ userName }}</p>
        <p class="text-xs text-slate-400 mb-4">{{ userEmail }}</p>
      </div>
      
      <div class="space-y-2">
        <button
          @click="[handleSignOut(), closeMobileMenu()]"
          :disabled="loading"
          class="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="!loading" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span v-if="!loading">Sign Out</span>
          <span v-else>Signing out...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useCreditsStore } from '../../stores/creditsStore'

interface Props {
  subtitle?: string
  showCredits?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: 'Turn your receipts into organized records, effortlessly.',
  showCredits: false
})

const router = useRouter()
const { isAuthenticated, userName, userEmail, signOut, loading } = useAuth()
const { credits, loading: creditsLoading } = useCreditsStore()
const showMobileMenu = ref(false)

const handleSignOut = async () => {
  const result = await signOut()
  if (result.success) {
    router.push('/auth')
  }
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}
</script>
