<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click="handleBackdropClick"
  >
    <div
      class="bg-slate-900 rounded-2xl border border-slate-700 p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-white">{{ title }}</h3>
        <button
          v-if="showCloseButton"
          @click="close"
          class="text-slate-400 hover:text-white transition-colors"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Processing State -->
      <div v-if="status === 'processing'" class="text-center">
        <div class="mb-4">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full">
            <div class="animate-spin">
              <svg class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        </div>
        <p class="text-slate-300 mb-2">{{ message }}</p>
        <p v-if="details" class="text-slate-400 text-sm">{{ details }}</p>
      </div>

      <!-- Success State -->
      <div v-else-if="status === 'success'" class="text-center">
        <div class="mb-4">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full">
            <svg class="h-8 w-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <p class="text-slate-300 mb-2">{{ message }}</p>
        <p v-if="details" class="text-slate-400 text-sm">{{ details }}</p>
        <button
          @click="close"
          class="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
        >
          Done
        </button>
      </div>

      <!-- Error State -->
      <div v-else-if="status === 'error'" class="text-center">
        <div class="mb-4">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full">
            <svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </div>
        <p class="text-slate-300 mb-2">{{ message }}</p>
        <p v-if="details" class="text-slate-400 text-sm">{{ details }}</p>
        <div class="mt-4 flex gap-3 justify-center">
          <button
            @click="$emit('retry')"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
          <button
            @click="close"
            class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  visible: boolean;
  status: 'processing' | 'success' | 'error';
  title?: string;
  message?: string;
  details?: string;
  showCloseButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Processing',
  message: '',
  details: '',
  showCloseButton: true,
});

const emit = defineEmits<{
  close: [];
  retry: [];
}>();

const title = computed(() => {
  switch (props.status) {
    case 'processing':
      return props.title || 'Processing...';
    case 'success':
      return 'Success!';
    case 'error':
      return 'Error';
    default:
      return props.title || 'Processing...';
  }
});

const message = computed(() => {
  if (props.message) return props.message;
  
  switch (props.status) {
    case 'processing':
      return 'Please wait while we process your request...';
    case 'success':
      return 'Operation completed successfully!';
    case 'error':
      return 'Something went wrong. Please try again.';
    default:
      return 'Processing...';
  }
});

const close = () => {
  emit('close');
};

const handleBackdropClick = () => {
  if (props.showCloseButton) {
    close();
  }
};
</script>
