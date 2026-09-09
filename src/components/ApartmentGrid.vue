<script setup>
import ApartmentCard from './ApartmentCard.vue'

defineProps({
  apartments: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <TransitionGroup
    tag="div"
    class="relative grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    enter-from-class="translate-y-3 opacity-0"
    enter-active-class="transition-all duration-300 ease-out"
    enter-to-class="translate-y-0 opacity-100"
    leave-from-class="translate-y-0 opacity-100"
    leave-active-class="pointer-events-none absolute w-full transition-all duration-300 ease-in"
    leave-to-class="scale-95 opacity-0"
    move-class="transition-transform duration-300 ease-out"
  >
    <ApartmentCard
      v-for="apartment in apartments"
      :key="apartment.id"
      :apartment="apartment"
    />
  </TransitionGroup>
</template>
