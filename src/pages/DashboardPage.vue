<template>
  <AuthGuard>
    <div class="min-h-screen bg-slate-950 text-white">
      <div class="mx-auto flex max-w-7xl flex-col gap-4 px-2 py-4 sm:gap-6 sm:px-4 sm:py-6 lg:px-8">
        <Header 
          subtitle="View and manage your saved receipts."
          :show-credits="true"
        />
        <!-- Stats Overview -->
        <div v-if="loading" class="grid gap-4 sm:gap-6 md:grid-cols-4">
          <!-- Loading skeleton -->
          <div class="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl backdrop-blur">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20">
                <div class="h-5 w-5 animate-pulse bg-blue-400 rounded-full"></div>
              </div>
              <div>
                <p class="text-xs text-slate-400">Loading...</p>
                <p class="text-lg font-semibold text-white">--</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="error" class="rounded-2xl border border-red-800 bg-red-900/20 p-8 shadow-2xl backdrop-blur">
          <div class="text-center">
            <svg class="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 9v2m0 4h.01M12 17a8 8 0 11-6 0 8 8 0 0118 0z"></path>
            </svg>
            <h3 class="text-lg font-semibold text-white mb-2">Error Loading Data</h3>
            <p class="text-slate-300">{{ error }}</p>
            <button @click="fetchDashboardMetrics" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Try Again
            </button>
          </div>
        </div>
        <div v-else class="grid gap-4 sm:gap-6 md:grid-cols-4">
          <div class="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl backdrop-blur">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20">
                <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <p class="text-xs text-slate-400">Total Receipts</p>
                <p class="text-lg font-semibold text-white">{{ totalReceipts }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl backdrop-blur">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600/20">
                <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p class="text-xs text-slate-400">Total Amount</p>
                <p class="text-lg font-semibold text-white">{{ formatCurrency(totalAmount) }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl backdrop-blur">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600/20">
                <svg class="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <p class="text-xs text-slate-400">This Month</p>
                <p class="text-lg font-semibold text-white">{{ formatCurrency(thisMonthAmount) }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl backdrop-blur">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600/20">
                <svg class="h-5 w-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p class="text-xs text-slate-400">Today</p>
                <p class="text-lg font-semibold text-white">{{ formatCurrency(todayAmount) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Receipts List -->
        <div class="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur">
          <div class="flex flex-col gap-4 p-4 sm:p-6">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 class="text-xl font-semibold text-white">Saved Receipts</h2>
              <div class="flex gap-2">
                <button
                  @click="exportToCSV"
                  class="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
                >
                  Export CSV
                </button>
                <router-link
                  to="/scan-receipts"
                  class="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
                >
                  Add New
                </router-link>
              </div>
            </div>

            <!-- Search and Filter -->
            <div class="flex flex-col gap-3 sm:flex-row">
              <div class="flex-1">
                <input
                  v-model="searchQuery"
                  @input="onSearchChange"
                  type="text"
                  placeholder="Search receipts..."
                  class="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                v-model="sortBy"
                @change="onSortChange"
                class="px-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>

            <!-- Receipts Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-slate-800">
                    <th class="text-left py-3 px-2 font-medium text-slate-400 w-24">Date Uploaded</th>
                    <th class="text-left py-3 px-2 font-medium text-slate-400 w-32">Provider</th>
                    <th class="text-left py-3 px-2 font-medium text-slate-400 w-24">Amount</th>
                    <th class="text-left py-3 px-2 font-medium text-slate-400 w-32">Reference</th>
                    <th class="text-right py-3 px-2 font-medium text-slate-400 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="paginatedReceipts.length === 0">
                    <td colspan="5" class="text-center py-8 text-slate-400">
                      No receipts found. Start by <router-link to="/scan-receipts" class="text-blue-400 hover:text-blue-300">scanning a receipt</router-link>.
                    </td>
                  </tr>
                  <tr v-else v-for="receipt in paginatedReceipts" :key="receipt.id" class="border-b border-slate-800 hover:bg-slate-800/50">
                    <td class="py-3 px-2 text-white w-24">{{ formatDate(receipt.created_at) }}</td>
                    <td class="py-3 px-2 text-white w-32">{{ receipt.provider }}</td>
                    <td class="py-3 px-2 text-white font-medium w-24">${{ receipt.amount.toFixed(2) }}</td>
                    <td class="py-3 px-2 w-32">
                      <button
                        @click="copyReference(receipt.reference_number)"
                        class="px-2 py-1 text-xs rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors cursor-pointer text-center"
                        title="Click to copy reference number"
                      >
                        {{ receipt.reference_number }}
                      </button>
                    </td>
                    <td class="py-3 px-2 text-right w-24">
                      <button
                        @click="viewReceipt(receipt)"
                        class="text-blue-400 hover:text-blue-300 mr-3"
                        title="View Details"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                      <button
                        @click="deleteReceipt(receipt.id)"
                        class="text-red-400 hover:text-red-300"
                        title="Delete"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <!-- Pagination Controls -->
              <div v-if="totalPages > 1" class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t border-slate-800">
                <div class="text-sm text-slate-400">
                  Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalCount) }} of {{ totalCount }} receipts
                </div>
                <div class="flex gap-1">
                  <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="px-3 py-1 text-sm bg-slate-800 text-slate-300 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div class="flex gap-1">
                    <button
                      v-for="page in Math.min(totalPages, 5)"
                      :key="page"
                      @click="goToPage(page)"
                      :class="[
                        'px-3 py-1 text-sm rounded-md transition-colors',
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <span
                      v-if="totalPages > 5"
                      class="px-3 py-1 text-sm text-slate-400"
                    >
                      ...
                    </span>
                    <button
                      v-if="totalPages > 5"
                      @click="goToPage(totalPages)"
                      :class="[
                        'px-3 py-1 text-sm rounded-md transition-colors',
                        currentPage === totalPages
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      ]"
                    >
                      {{ totalPages }}
                    </button>
                  </div>
                  
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="px-3 py-1 text-sm bg-slate-800 text-slate-300 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Success Message Toast -->
      <div
        v-if="copySuccess"
        class="fixed bottom-4 right-4 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out text-xs"
      >
        Reference number copied to clipboard!
      </div>
    </div>
  </AuthGuard>

  <!-- Delete Confirmation Dialog -->
  <ConfirmationDialog
    :visible="showDeleteConfirmDialog"
    title="Delete Receipt?"
    message="Are you sure you want to delete this receipt? This action cannot be undone."
    confirm-text="Delete"
    cancel-text="Cancel"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Header from '../components/shared/Header.vue'
import AuthGuard from '../components/auth/AuthGuard.vue'
import ConfirmationDialog from '../components/shared/ConfirmationDialog.vue'
import { supabase } from '../config/supabase'
import { ReceiptsService, type Receipt } from '../services/receipts.service'

// State for dashboard metrics
const receipts = ref<Receipt[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const copySuccess = ref(false)
const totalCount = ref(0)
const showDeleteConfirmDialog = ref(false)
const receiptToDelete = ref<string | null>(null)

// Direct metric values from Supabase
const totalReceipts = ref(0)
const totalAmount = ref(0)
const todayAmount = ref(0)
const thisMonthAmount = ref(0)

// Fetch receipts from Supabase
const fetchReceipts = async () => {
  try {
    const receiptsData = await ReceiptsService.fetchReceiptsWithFilters(
      currentPage.value,
      itemsPerPage.value,
      searchQuery.value || undefined,
      sortBy.value
    )
    receipts.value = receiptsData.receipts
    totalCount.value = receiptsData.total
    console.log('Fetched receipts:', receiptsData.receipts.length, 'Total:', receiptsData.total)
  } catch (err) {
    console.error('Failed to fetch receipts:', err)
    // Don't set error state for receipts fetch failure, just log it
  }
}

// Fetch dashboard metrics from Supabase
const fetchDashboardMetrics = async () => {
  try {
    loading.value = true
    error.value = null
    /**
     * sample data
     * {
            "todayAmount": 0,
            "totalAmount": 30844.00,
            "totalReceipts": 41,
            "thisMonthAmount": 30844.00
        }
     */
    const { data, error: rpcError } = await supabase.rpc('get_dashboard_metrics')
    console.log('Dashboard metrics data:', data)
    if (rpcError) {
      error.value = rpcError.message || 'Failed to fetch dashboard data'
      console.error('Dashboard metrics error:', rpcError)
    } else {
      // Transform the data to match our interface
      totalReceipts.value = data.totalReceipts
      totalAmount.value = data.totalAmount
      todayAmount.value = data.todayAmount
      thisMonthAmount.value = data.thisMonthAmount
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    console.error('Dashboard fetch error:', err)
  } finally {
    loading.value = false
  }
}

// Fetch all data
const fetchAllData = async () => {
  await Promise.all([
    fetchDashboardMetrics(),
    fetchReceipts()
  ])
}

const searchQuery = ref('')
const sortBy = ref('date-desc')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(25)

// Pagination computed properties
const totalPages = computed(() => {
  return Math.ceil(totalCount.value / itemsPerPage.value)
})

const paginatedReceipts = computed(() => {
  return receipts.value
})

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const viewReceipt = (receipt: Receipt) => {
  // TODO: Implement receipt view modal or navigation
  console.log('View receipt:', receipt)
}

const deleteReceipt = (id: string) => {
  receiptToDelete.value = id
  showDeleteConfirmDialog.value = true
}

const confirmDelete = async () => {
  try {
    if (receiptToDelete.value) {
      await ReceiptsService.deleteReceipt(receiptToDelete.value)
      // Remove from local state
      receipts.value = receipts.value.filter(r => r.id !== receiptToDelete.value)
      // Refresh metrics
      await fetchDashboardMetrics()
    }
  } catch (error) {
    console.error('Failed to delete receipt:', error)
    alert('Failed to delete receipt. Please try again.')
  } finally {
    showDeleteConfirmDialog.value = false
    receiptToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteConfirmDialog.value = false
  receiptToDelete.value = null
}

const copyReference = async (referenceNumber: string) => {
  try {
    await navigator.clipboard.writeText(referenceNumber)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy reference number:', err)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = referenceNumber
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  }
}

// Pagination methods
const goToPage = async (page: number) => {
  currentPage.value = page
  await fetchReceipts()
}

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await fetchReceipts()
  }
}

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    await fetchReceipts()
  }
}

// Search and sort methods
const onSearchChange = async () => {
  currentPage.value = 1 // Reset to first page when searching
  await fetchReceipts()
}

const onSortChange = async () => {
  currentPage.value = 1 // Reset to first page when sorting
  await fetchReceipts()
}

const exportToCSV = () => {
  if (paginatedReceipts.value.length === 0) {
    alert('No receipts to export')
    return
  }

  // Define CSV headers matching the table columns
  const headers = ['Date Uploaded', 'Provider', 'Amount', 'Reference Number']
  
  // Convert receipts data to CSV format
  const csvContent = [
    headers.join(','),
    ...paginatedReceipts.value.map(receipt => [
      formatDate(receipt.created_at),
      receipt.provider,
      receipt.amount.toFixed(2),
      receipt.reference_number
    ].map(field => `"${field}"`).join(','))
  ].join('\n')

  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  
  // Create download link
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  
  // Generate filename with current date
  const today = new Date().toISOString().split('T')[0]
  link.setAttribute('download', `receipts_export_${today}.csv`)
  
  // Trigger download
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  console.log('CSV exported successfully')
}

onMounted(() => {
  fetchAllData()
})
</script>
