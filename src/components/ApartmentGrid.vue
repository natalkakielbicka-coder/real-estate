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
  <div class="apartments-grid">
    <ApartmentCard
      v-for="apartment in apartments"
      :key="apartment.id"
      :apartment="apartment"
    />
  </div>
</template>

<style scoped>
.apartments-grid {
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

@media (max-width: 1199px) {
  .apartments-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .apartments-grid {
    grid-template-columns: 1fr;
  }
}
</style>
