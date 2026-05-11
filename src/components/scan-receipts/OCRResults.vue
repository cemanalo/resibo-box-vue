<template>
  <section class="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl backdrop-blur sm:p-6 w-full max-w-full overflow-hidden">
    <div class="mb-6 sm:mb-8">
      <div class="mb-4">
        <h2 class="text-xl font-semibold text-white">Scanned Results</h2>
        <p class="mt-1 text-sm text-slate-400">
          Scanned receipt data preview.
        </p>
      </div>

      <div 
        v-if="parsedReceipts && parsedReceipts.length > 0"
        class="flex flex-wrap gap-2 justify-end mt-2">
        <button
          @click="exportToCSV"
          class="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
        >
          Export CSV
        </button>
        <button
          @click="clearAndUploadMore"
          class="px-3 py-1.5 text-xs font-medium text-orange-400 bg-orange-600/20 border border-orange-600 rounded-md hover:bg-orange-600/30 hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
        >
          Clear & Upload More
        </button>
        <router-link
          to="/dashboard"
          class="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
        >
          Back to Dashboard
        </router-link>
      </div>
    </div>

    <!-- Show table only when there are records -->
    <div v-if="parsedReceipts && parsedReceipts.length > 0" class="overflow-hidden rounded-2xl border border-slate-800">
      <div class="overflow-x-auto">
        <table class="w-full divide-y divide-slate-800 text-xs">
          <thead class="bg-slate-950/80">
            <tr>
              <th class="px-2 py-2 text-left font-medium text-slate-400 sm:px-3 sm:py-3">
                <span class="hidden sm:inline">Image</span>
                <span class="sm:hidden">📷</span>
              </th>
              <th class="px-2 py-2 text-left font-medium text-slate-400 sm:px-3 sm:py-3">
                Provider
              </th>
              <th class="px-2 py-2 text-left font-medium text-slate-400 sm:px-3 sm:py-3">
                <span class="hidden sm:inline">Reference</span>
                <span class="sm:hidden">Ref #</span>
              </th>
              <th class="px-2 py-2 text-left font-medium text-slate-400 sm:px-3 sm:py-3">
                Amount
              </th>
              <th class="px-2 py-2 text-left font-medium text-slate-400 sm:px-3 sm:py-3">
                <span class="hidden sm:inline">Confidence</span>
                <span class="sm:hidden">%</span>
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-800">
            <tr v-for="result in parsedReceipts" :key="result.id" class="bg-slate-900/30">
              <td class="px-2 py-2 sm:px-3 sm:py-3">
                <div 
                  v-if="result.imageUrl"
                  class="cursor-pointer"
                  @click="openImagePreview(result.imageUrl, result.fileName || 'Receipt Image')"
                >
                  <img 
                    :src="result.imageUrl" 
                    :alt="result.fileName || 'Receipt Image'"
                    class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover border border-slate-700 transition hover:border-slate-500"
                  />
                </div>
                <div v-else class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg border border-slate-700 bg-slate-800 flex items-center justify-center">
                  <span class="text-xs text-slate-500">No</span>
                </div>
              </td>
              <td class="px-2 py-2 sm:px-3 sm:py-3">
                <div class="font-medium text-white truncate max-w-[80px] sm:max-w-none">{{ result.provider }}</div>
              </td>
              <td class="px-2 py-2 font-mono text-xs text-slate-300 sm:px-3 sm:py-3">
                <div class="truncate max-w-[60px] sm:max-w-none">
                  <span class="sm:hidden">…{{ result.referenceNumber.slice(-6) || result.referenceNumber }}</span>
                  <span class="hidden sm:inline">{{ result.referenceNumber }}</span>
                </div>
              </td>
              <td class="px-2 py-2 font-medium text-slate-300 sm:px-3 sm:py-3">
                <div class="truncate">{{ result.amount }}</div>
              </td>
              <td class="px-2 py-2 sm:px-3 sm:py-3">
                <span class="text-xs font-medium text-slate-300">{{ result.confidence }}%</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Note about images -->
    <div v-if="parsedReceipts && parsedReceipts.length > 0" class="mt-4 text-xs text-slate-500 text-center">
      <em>*Note: Receipt images are for preview only and will not be saved.</em>
    </div>

    <!-- Empty state when no records -->
    <div v-else class="overflow-hidden rounded-2xl border border-slate-800">
      <div class="p-8 sm:p-12 text-center">
        <div class="mx-auto w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
          <svg class="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zm10-10V2a1 1 0 00-1-1h-4a1 1 0 00-1 1v2h6z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-white mb-2">No receipts found</h3>
        <p class="text-sm text-slate-400 max-w-md mx-auto">
          Start by uploading some receipt screenshots to see the parsed results here.
        </p>
      </div>
    </div>
  </section>

  <!-- Image Preview Modal -->
  <ImagePreviewModal
    :visible="!!selectedImage"
    :image-url="selectedImage?.url || null"
    :image-name="selectedImage?.name || 'Receipt Image'"
    @close="closeImagePreview"
  />

  <!-- Clear Confirmation Dialog -->
  <ConfirmationDialog
    :visible="showClearConfirmDialog"
    title="Clear Receipts?"
    message="Are you sure you want to clear all processed receipts and upload new ones? This action cannot be undone."
    confirm-text="Clear & Upload More"
    cancel-text="Cancel"
    @confirm="confirmClear"
    @cancel="cancelClear"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CSVService } from '../../services/csv.service';
import ImagePreviewModal from '../shared/ImagePreviewModal.vue';
import ConfirmationDialog from '../shared/ConfirmationDialog.vue';
import type { ParsedReceipt } from '../../types/receipt.types';

const props = defineProps<{
  parsedReceipts: ParsedReceipt[];
}>();

const emit = defineEmits<{
  'clear-receipts': [];
}>();

const selectedImage = ref<{ url: string; name: string } | null>(null);
const showClearConfirmDialog = ref(false);

// CSV Export functionality
const exportToCSV = () => {
  CSVService.exportReceipts(props.parsedReceipts);
};

const openImagePreview = (imageUrl: string, fileName: string) => {
  selectedImage.value = { url: imageUrl, name: fileName };
};

const closeImagePreview = () => {
  selectedImage.value = null;
};

const clearAndUploadMore = () => {
  showClearConfirmDialog.value = true;
};

const confirmClear = () => {
  showClearConfirmDialog.value = false;
  emit('clear-receipts');
};

const cancelClear = () => {
  showClearConfirmDialog.value = false;
};

</script>
