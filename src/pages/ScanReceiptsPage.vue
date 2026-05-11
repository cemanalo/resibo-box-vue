<template>
  <AuthGuard>
    <div class="min-h-screen bg-slate-950 text-white">
      <div class="mx-auto flex max-w-7xl flex-col gap-4 px-2 py-4 sm:gap-6 sm:px-4 sm:py-6 lg:px-8">
        <!-- Header -->
        <Header 
          subtitle="Upload receipt screenshots and extract payment data automatically."
          :show-credits="true"
        />
        <!-- Main Content -->
        <main class="grid gap-4 sm:gap-6 md:grid-cols-[1.2fr_1fr]">
          <!-- Upload Section -->
          <UploadSection ref="uploadSectionRef" @receipts-updated="handleReceiptsUpdated" />

          <!-- OCR Results Section -->
          <OCRResults :parsed-receipts="parsedReceipts" @clear-receipts="handleClearReceipts" />
        </main>
      </div>
    </div>
  </AuthGuard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UploadSection from '../components/scan-receipts/UploadSection.vue';
import OCRResults from '../components/scan-receipts/OCRResults.vue';
import AuthGuard from '../components/auth/AuthGuard.vue';
import Header from '../components/shared/Header.vue';
import type { ParsedReceipt } from '../types/receipt.types';

const parsedReceipts = ref<ParsedReceipt[]>([]);
const uploadSectionRef = ref<InstanceType<typeof UploadSection> | null>(null);

const handleReceiptsUpdated = (receipts: ParsedReceipt[]) => {
  parsedReceipts.value = receipts;
};

const handleClearReceipts = () => {
  parsedReceipts.value = [];
  // Clear the upload section
  if (uploadSectionRef.value) {
    uploadSectionRef.value.clearFiles();
  }
};
</script>
