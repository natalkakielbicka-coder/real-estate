<script setup>
import ApartmentListItem from './ApartmentListItem.vue'

defineProps({
  apartments: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="apartment-list">
    <ApartmentListItem
      v-for="apartment in apartments"
      :key="apartment.id"
      :apartment="apartment"
    />
  </div>
</template>

<style scoped>
.apartment-list {
  display: grid;
  gap: 18px;
}
</style>
