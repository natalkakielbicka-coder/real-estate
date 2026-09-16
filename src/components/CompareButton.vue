<script setup>
defineProps({
  isSelected: {
    type: Boolean,
    default: false
  },
  apartmentNumber: {
    type: String,
    required: true
  }
})

defineEmits(['toggle'])
</script>

<template>
  <button
    class="group inline-flex min-h-8 items-center justify-center gap-1.5 border-0 bg-transparent px-1 text-[10px] font-semibold transition-colors duration-200"
    :class="isSelected ? 'text-gold' : 'text-muted hover:text-brand'"
    type="button"
    :aria-pressed="isSelected"
    :aria-label="
      isSelected
        ? `Usuń mieszkanie ${apartmentNumber} z porównania`
        : `Dodaj mieszkanie ${apartmentNumber} do porównania`
    "
    @click="$emit('toggle')"
  >
    <span
      class="text-sm leading-none transition-transform duration-200 group-hover:translate-x-0.5"
      aria-hidden="true"
    >
      ⇄
    </span>

    <span>
      {{ isSelected ? 'W porównaniu' : 'Dodaj do porównania' }}
    </span>
  </button>
</template>
