<script setup>
import { computed } from 'vue'
import { useToast } from '../composables/useToast'

const { toast, hideToast } = useToast()

const toastStyles = computed(() => {
  const variants = {
    success: {
      icon: '✓',
      classes: 'border-[#3d806d] bg-brand text-panel'
    },
    error: {
      icon: '!',
      classes: 'border-[#b84b4b] bg-[#7d3030] text-panel'
    },
    info: {
      icon: 'i',
      classes: 'border-gold bg-panel text-[var(--color-text)]'
    }
  }

  return variants[toast.value.type] || variants.success
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-4 opacity-0"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="translate-y-4 opacity-0"
    >
      <div
        v-if="toast.isVisible"
        class="fixed right-5 bottom-5 z-[200] flex w-[min(380px,calc(100%-40px))] items-center gap-3 rounded-[8px] border px-5 py-4 shadow-[0_16px_45px_rgba(23,63,53,0.22)]"
        :class="toastStyles.classes"
        role="status"
        aria-live="polite"
      >
        <span
          class="grid size-6 shrink-0 place-items-center rounded-full border border-current text-xs font-bold"
          aria-hidden="true"
        >
          {{ toastStyles.icon }}
        </span>

        <p class="mb-0 flex-1 text-sm font-semibold">
          {{ toast.message }}
        </p>

        <button
          class="grid size-7 shrink-0 place-items-center text-xl leading-none opacity-60 transition-opacity hover:opacity-100"
          type="button"
          aria-label="Zamknij komunikat"
          @click="hideToast"
        >
          ×
        </button>
      </div>
    </Transition>
  </Teleport>
</template>
