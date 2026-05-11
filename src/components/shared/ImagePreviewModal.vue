<template>
  <!-- Image Preview Modal -->
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    @click="handleClose"
  >
    <div 
      class="relative max-h-[90vh] max-w-[90vw] overflow-auto"
      @click.stop
    >
      <button
        @click="handleClose"
        class="sticky top-0 right-0 float-right rounded-full bg-slate-800 p-2 text-white transition hover:bg-slate-700 z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="h-5 w-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      
      <div class="p-4">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          :alt="imageName"
          class="w-full h-auto rounded-lg"
        />
        
        <div class="mt-3 text-center">
          <p class="text-sm font-medium text-white">{{ imageName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean;
  imageUrl: string | null;
  imageName?: string;
}

interface Emits {
  (e: 'close'): void;
}

const props = withDefaults(defineProps<Props>(), {
  imageName: 'Preview Image'
});

const emit = defineEmits<Emits>();

const handleClose = () => {
  emit('close');
};
</script>
