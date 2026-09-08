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
  <div class="grid gap-[18px]">
    <ApartmentListItem
      v-for="apartment in apartments"
      :key="apartment.id"
      :apartment="apartment"
    />
  </div>
</template>
