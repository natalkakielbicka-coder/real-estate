<script setup>
import { useId } from 'vue'

defineProps({
  text: {
    type: String,
    required: true
  }
})

const tooltipId = useId()
</script>

<template>
  <span class="group relative inline-flex">
    <button
      class="grid size-5 cursor-help place-items-center rounded-full border border-muted bg-transparent text-[10px] font-bold text-muted transition-colors hover:border-gold hover:bg-gold hover:text-white focus-visible:border-gold focus-visible:bg-gold focus-visible:text-white focus-visible:outline-none"
      type="button"
      aria-label="Pokaż dodatkowe informacje"
      :aria-describedby="tooltipId"
    >
      i
    </button>

    <span
      :id="tooltipId"
      class="pointer-events-none invisible absolute bottom-[calc(100%+12px)] left-0 z-30 w-[min(250px,calc(100vw-48px))] translate-y-1 rounded-[6px] bg-brand px-4 py-3 text-left text-xs leading-[1.6] font-normal text-white opacity-0 shadow-[0_12px_30px_rgba(23,63,53,0.22)] transition-[opacity,transform,visibility] duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
      role="tooltip"
    >
      {{ text }}

      <span
        class="absolute top-full left-[6px] border-x-[7px] border-t-[7px] border-x-transparent border-t-brand"
        aria-hidden="true"
      ></span>
    </span>
  </span>
</template>
