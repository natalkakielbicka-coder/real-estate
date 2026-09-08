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
  <div class="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <ApartmentCard
      v-for="apartment in apartments"
      :key="apartment.id"
      :apartment="apartment"
    />
  </div>
</template>
