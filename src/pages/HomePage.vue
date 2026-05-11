<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <div class="mx-auto flex max-w-7xl flex-col gap-4 px-2 py-4 sm:gap-6 sm:px-4 sm:py-6 lg:px-8">
      <!-- Header -->
      <Header 
        subtitle="Turn your receipts into organized records, effortlessly."
        :show-credits="false"
      />

      <!-- Main Content -->
      <main class="flex flex-col gap-6">
        <!-- Features Section -->
        <section class="grid gap-4 sm:gap-6 md:grid-cols-3">
          <div
            class="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl backdrop-blur sm:p-6">
            <div class="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white">GCash Capture</h3>
            <p class="text-sm text-slate-400">
              Upload multiple GCash screenshots and automatically extract payment details with advanced text recognition.
            </p>
          </div>

          <div
            class="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl backdrop-blur sm:p-6">
            <div class="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white">Smart Data Extraction</h3>
            <p class="text-sm text-slate-400">
              Automatically captures provider names, reference numbers, and amounts from your receipts.
            </p>
          </div>

          <div
            class="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl backdrop-blur sm:p-6">
            <div class="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white">Analytics & Export</h3>
            <p class="text-sm text-slate-400">
              Track spending with dashboard analytics and export your receipt data to CSV for bookkeeping and reporting.
            </p>
          </div>
        </section>

        <!-- CTA Section -->
        <section
          class="flex flex-col items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur sm:p-8 text-center">
          <div v-if="isAuthenticated" class="space-y-4">
            <h2 class="text-2xl font-bold tracking-tight text-white">Welcome back!</h2>
            <p class="text-slate-400">Ready to manage your receipts?</p>
            <router-link
              to="/dashboard"
              class="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
            >
              Go to Dashboard
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </router-link>
          </div>
          
          <div v-else class="space-y-4">
            <h2 class="text-2xl font-bold tracking-tight text-white">Start Organizing Today</h2>
            <p class="text-slate-400">Say goodbye to messy receipts and hello to organized records.</p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <router-link
                to="/auth"
                class="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
              >
                Sign Up Free
              </router-link>
              <router-link
                to="/auth"
                class="inline-flex items-center px-6 py-3 text-sm font-medium text-white border border-slate-700 bg-slate-800 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
              >
                Sign In
              </router-link>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '../components/shared/Header.vue'
import { useAuth } from '../composables/useAuth'

const { isAuthenticated } = useAuth()
</script>
