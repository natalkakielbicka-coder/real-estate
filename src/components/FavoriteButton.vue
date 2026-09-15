<script setup>
defineProps({
  isFavorite: {
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
    class="grid size-[42px] place-items-center rounded-full border-0 bg-white/90 text-[25px] leading-none transition-[color,transform] duration-200 hover:scale-[1.08] hover:text-[#a94d4d]"
    :class="isFavorite ? 'text-[#a94d4d]' : 'text-brand'"
    type="button"
    :aria-label="
      isFavorite
        ? `Usuń mieszkanie ${apartmentNumber} z ulubionych`
        : `Dodaj mieszkanie ${apartmentNumber} do ulubionych`
    "
    :aria-pressed="isFavorite"
    :title="isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'"
    @click="$emit('toggle')"
  >
    <span aria-hidden="true">
      {{ isFavorite ? '♥' : '♡' }}
    </span>
  </button>
</template>
