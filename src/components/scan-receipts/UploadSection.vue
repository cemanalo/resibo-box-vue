<template>
  <section class="rounded-3xl border border-slate-800 bg-slate-900/80 p-3 sm:p-5 shadow-2xl backdrop-blur w-full max-w-full overflow-hidden">
    <div class="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="text-center sm:text-left">
        <h2 class="text-xl font-semibold">Upload Screenshots</h2>
        <p class="mt-1 text-sm text-slate-400">
          Upload multiple GCash screenshots.
        </p>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      multiple
      accept="image/*"
      class="hidden"
      @change="handleFiles"
    />

    <!-- Drop Zone -->
    <div
      @click="triggerFileUpload"
      @dragover.prevent
      @drop.prevent="handleDrop"
      class="flex min-h-[200px] sm:min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-700 bg-slate-950/50 p-3 sm:p-8 text-center transition hover:border-blue-500"
    >
      <div class="mb-4 rounded-full border border-slate-700 bg-slate-900 p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-10 w-10 text-slate-300"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 16.5V3.75m0 0L8.25 7.5M12 3.75l3.75 3.75M3.75 15v3A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18v-3"
          />
        </svg>
      </div>

      <h3 class="text-lg font-semibold">Drop screenshots here</h3>
      <p class="mt-2 max-w-sm text-sm text-slate-400">
        Drag and drop receipt screenshots or click the button above to upload.
      </p>

      </div>

    <!-- Process Receipts and Toggle Buttons -->
    <div v-if="uploadedFiles.length > 0" class="mt-4 flex justify-end gap-3">
      <button
        @click="showScanConfirmation"
        :disabled="uploadedFiles.length === 0"
        :class="[
          'rounded-2xl px-4 py-2 text-sm font-semibold transition w-full sm:w-auto',
          uploadedFiles.length === 0 
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-500'
        ]"
      >
        Process Receipts
      </button>
      <button
        v-if="uploadedFiles.length > 1"
        @click="showUploadedFiles = !showUploadedFiles"
        class="rounded-2xl border border-slate-700 bg-slate-800/50 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-700/50"
      >
        {{ showUploadedFiles ? 'Hide' : 'Show' }} ({{ uploadedFiles.length }})
      </button>
    </div>

    <!-- Uploaded Files -->
    <div v-show="showUploadedFiles" class="mt-6 space-y-3 max-w-full">
      <div
        v-for="file in uploadedFiles"
        :key="file.id"
        class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-3 overflow-hidden w-full"
      >
        <div class="flex justify-center sm:justify-start flex-shrink-0">
          <img
            :src="file.preview"
            alt="Receipt Preview"
            class="h-14 w-14 sm:h-20 sm:w-20 rounded-xl object-cover cursor-pointer transition hover:opacity-80"
            @click="openPreview(file.preview, file.name)"
          />
        </div>

        <div class="min-w-0 flex-1 overflow-hidden w-full">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <p class="truncate text-sm font-medium text-center sm:text-left min-w-0 flex-1 pr-2">
              {{ file.name }}
            </p>

            <span
              :class="statusClass(file.status)"
              class="rounded-full px-2 py-1 text-xs font-semibold self-center sm:self-auto flex-shrink-0"
            >
              {{ file.status }}
            </span>
          </div>

          <div class="mt-2 sm:mt-3">
            <div class="mb-1 flex items-center justify-between text-xs text-slate-400">
              <span class="text-center sm:text-left truncate flex-1 pr-2">Progress</span>
              <span class="flex-shrink-0">{{ file.progress }}%</span>
            </div>

            <div class="h-2 overflow-hidden rounded-full bg-slate-800 w-full">
              <div
                class="h-full rounded-full bg-blue-500 transition-all duration-300"
                :style="{ width: `${file.progress}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toggle Uploaded Files (Bottom) -->
    <div v-if="uploadedFiles.length > 1 && showUploadedFiles" class="mt-4 flex justify-end gap-3">
      <button
        @click="showScanConfirmation"
        :disabled="uploadedFiles.length === 0"
        :class="[
          'rounded-2xl px-4 py-2 text-sm font-semibold transition w-full sm:w-auto',
          uploadedFiles.length === 0 
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-500'
        ]"
      >
        Process Receipts
      </button>
      <button
        @click="showUploadedFiles = !showUploadedFiles"
        class="rounded-2xl border border-slate-700 bg-slate-800/50 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-700/50"
      >
        {{ showUploadedFiles ? 'Hide' : 'Show' }} Files ({{ uploadedFiles.length }})
      </button>
    </div>
  </section>

  <!-- Processing Modal -->
  <ProcessingModal
    :visible="processingModal.visible"
    :status="processingModal.status"
    :title="processingModal.title"
    :message="processingModal.message"
    :details="processingModal.details"
    @close="closeProcessingModal"
    @retry="retryProcessing"
  />

  <!-- Image Preview Modal -->
  <ImagePreviewModal
    :visible="!!selectedPreview"
    :image-url="selectedPreview?.url || null"
    :image-name="selectedPreview?.name || 'Preview Image'"
    @close="closePreview"
  />

  <!-- Scan Confirmation Dialog -->
  <ConfirmationDialog
    :visible="showConfirmDialog"
    title="Start Scanning?"
    :message="`You have <span class='font-semibold text-yellow-400'>${uploadedFiles.length}</span> image${uploadedFiles.length > 1 ? 's' : ''} to scan. This will use <span class='font-semibold text-yellow-400'>${uploadedFiles.length}</span> credit${uploadedFiles.length > 1 ? 's' : ''} from your account.<br><br>Don't worry - if any image can't be processed clearly, you won't be charged for that one. Make sure your screenshots are clear and complete before proceeding.`"
    :confirm-text="`Scan ${uploadedFiles.length} Image${uploadedFiles.length > 1 ? 's' : ''}`"
    cancel-text="Cancel"
    @confirm="confirmScan"
    @cancel="cancelScan"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TesseractService } from '../../services/tesseract.service';
import { ReceiptParserService } from '../../services/receipt.parser.service';
import { supabase } from '../../config/supabase';
import ImagePreviewModal from '../shared/ImagePreviewModal.vue';
import ConfirmationDialog from '../shared/ConfirmationDialog.vue';
import ProcessingModal from '../shared/ProcessingModal.vue';
import { useCreditsStore } from '../../stores/creditsStore';
import type { ParsedReceipt } from '../../types/receipt.types';

// Define emit events
const emit = defineEmits<{
  'receipt-parsed': [receipt: ParsedReceipt];
  'receipts-updated': [receipts: ParsedReceipt[]];
}>();

interface UploadedFile {
  id: number;
  name: string;
  preview: string;
  progress: number;
  status: 'Queued' | 'Processing' | 'Completed' | 'Error';
  file?: File;
  ocrText?: string;
  error?: string;
  parsedReceipt?: ParsedReceipt;
}

const fileInput = ref<HTMLInputElement | null>(null);
const uploadedFiles = ref<UploadedFile[]>([]);
const parsedReceipts = ref<ParsedReceipt[]>([]);
const selectedPreview = ref<{ url: string; name: string } | null>(null);
const showUploadedFiles = ref(true);
const showConfirmDialog = ref(false);
const processingModal = ref({
  visible: false,
  status: 'processing' as 'processing' | 'success' | 'error',
  title: '',
  message: '',
  details: ''
});

// Use credits store
const { fetchCredits } = useCreditsStore();

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const showScanConfirmation = () => {
  showConfirmDialog.value = true;
};

const confirmScan = () => {
  showConfirmDialog.value = false;
  
  // Show processing modal
  processingModal.value = {
    visible: true,
    status: 'processing',
    title: 'Processing Receipts',
    message: 'Scanning and extracting data from your receipts...',
    details: ''
  };
  
  // Process OCR for all uploaded files
  const ocrPromises = uploadedFiles.value.map((uploadedFile) => {
    if (uploadedFile.file) {
      return processOCR(uploadedFile.file, uploadedFile.id);
    }
    return Promise.resolve();
  });
  
  // Wait for all OCR processing to complete
  Promise.all(ocrPromises).then(() => {
    // Update modal for backend processing
    processingModal.value.message = 'Validating and saving receipts...';
    
    // After all OCR is done, call the backend endpoint
    callProcessReceiptsEndpoint().then(() => {
      // Success - refresh credits
      fetchCredits();
      
      processingModal.value = {
        visible: true,
        status: 'success',
        title: 'Success!',
        message: `Successfully processed ${parsedReceipts.value.length} receipts`,
        details: 'Your receipts have been saved and are ready to view.'
      };
    }).catch((error) => {
      console.log(error);
      // Error
      processingModal.value = {
        visible: true,
        status: 'error',
        title: 'Processing Failed',
        message: 'Failed to process receipts',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    });
  });
};

const cancelScan = () => {
  showConfirmDialog.value = false;
};

const handleFiles = (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (!target.files) {
    return;
  }

  processFiles(target.files);
};

const handleDrop = (event: DragEvent) => {
  if (!event.dataTransfer?.files) {
    return;
  }

  processFiles(event.dataTransfer.files);
};

const processFiles = (files: FileList) => {
  Array.from(files).forEach((file, index) => {
    const preview = URL.createObjectURL(file);
    const fileId = Date.now() + index;

    uploadedFiles.value.push({
      id: fileId,
      name: file.name,
      preview,
      progress: 0,
      status: 'Queued',
      file: file,
    });
  });
};

const processOCR = async (file: File, fileId: number) => {
  const uploadedFile = uploadedFiles.value.find((item) => item.id === fileId);
  
  if (!uploadedFile) {
    return;
  }

  // Validate file before processing
  if (!TesseractService.validateFile(file)) {
    uploadedFile.status = 'Error';
    uploadedFile.error = 'Invalid file type or size. Please use JPEG, PNG, BMP, or TIFF files under 10MB.';
    return;
  }

  try {
    uploadedFile.status = 'Processing';
    uploadedFile.progress = 0;

    const result = await TesseractService.recognizeText(
      file,
      (progress) => {
        uploadedFile.progress = progress;
      }
    );

    uploadedFile.ocrText = result.text;
    uploadedFile.progress = 100;
    uploadedFile.status = 'Completed';
    
    // Parse the OCR text to extract receipt data
    const parseResult = ReceiptParserService.parseReceipt(result.text, result.confidence);
    
    if (parseResult.success && parseResult.receipt) {
      // Add image reference to parsed receipt
      const receiptWithImage = {
        ...parseResult.receipt,
        imageUrl: uploadedFile.preview,
        fileName: uploadedFile.name
      };
      
      uploadedFile.parsedReceipt = receiptWithImage;
      // Don't emit events yet - wait for backend processing
    } else {
      uploadedFile.status = 'Error';
      uploadedFile.error = parseResult.error || 'Failed to parse receipt';
      console.error('Parsing failed:', parseResult.error);
    }
    
  } catch (error) {
    uploadedFile.status = 'Error';
    uploadedFile.error = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('OCR processing failed for', file.name, ':', error);
  }
};

const callProcessReceiptsEndpoint = async () => {
  const successfulReceipts = uploadedFiles.value
    .filter(file => file.parsedReceipt)
    .map(file => file.parsedReceipt!);
  
  if (successfulReceipts.length === 0) {
    throw new Error('No successful receipts to process');
  }
  
  try {
    // Update modal with progress
    processingModal.value.details = `Processing ${successfulReceipts.length} receipts...`;
    
    // Call the Supabase function
    const { data, error } = await supabase.functions.invoke('process-receipts', {
      body: { receipts: successfulReceipts }
    });

    if (error) {
      console.log('Backend error:', error);
      console.log('Error context:', error.context);
      // Try to extract the backend error message from response
      let errorMessage = 'Backend processing failed';
      
      if (error.context?.body) {
        try {
          let errorBody;
          
          // Handle ReadableStream
          if (error.context.body instanceof ReadableStream) {
            const reader = error.context.body.getReader();
            const decoder = new TextDecoder();
            let result = '';
            
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              result += decoder.decode(value, { stream: true });
            }
            
            errorBody = JSON.parse(result);
          } else {
            // Handle string or object
            errorBody = typeof error.context.body === 'string' 
              ? JSON.parse(error.context.body) 
              : error.context.body;
          }
          
          if (errorBody.message) {
            errorMessage = errorBody.message;
          } else if (errorBody.error) {
            errorMessage = errorBody.error;
          }
        } catch (parseError) {
          // If parsing fails, use the original error message
          errorMessage = error.message || 'Backend processing failed';
        }
      } else {
        errorMessage = error.message || 'Backend processing failed';
      }
      
      throw new Error(errorMessage);
    }
    
    // Backend processing successful, now emit the results
    parsedReceipts.value = successfulReceipts;
    successfulReceipts.forEach(receipt => {
      emit('receipt-parsed', receipt);
    });
    emit('receipts-updated', parsedReceipts.value);
    
    return data;
    
  } catch (error) {
    throw error;
  }
};

const closeProcessingModal = () => {
  processingModal.value.visible = false;
};

const retryProcessing = () => {
  closeProcessingModal();
  confirmScan();
};

const openPreview = (url: string, name: string) => {
  selectedPreview.value = { url, name };
};

const closePreview = () => {
  selectedPreview.value = null;
};

const clearFiles = () => {
  uploadedFiles.value = [];
  parsedReceipts.value = [];
  // Clear the file input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Expose the clearFiles method to parent
defineExpose({
  clearFiles
});

const statusClass = (status: UploadedFile['status']) => {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-500/10 text-emerald-400';
    case 'Processing':
      return 'bg-amber-500/10 text-amber-400';
    case 'Error':
      return 'bg-red-500/10 text-red-400';
    default:
      return 'bg-slate-700 text-slate-300';
  }
};
</script>
