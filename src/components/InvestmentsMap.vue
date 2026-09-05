<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const mapContainer = ref(null)

let mapInstance = null

onMounted(() => {
  mapInstance = L.map(mapContainer.value).setView([52.0, 19.1], 6)

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapInstance)
})

onBeforeUnmount(() => {
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>

<template>
  <div class="investments-map">
    <div
      ref="mapContainer"
      class="investments-map__container"
    ></div>
  </div>
</template>

<style scoped>
.investments-map {
  overflow: hidden;
  padding: 12px;
  background-color: var(--color-surface);
  box-shadow: 0 14px 45px rgba(23, 63, 53, 0.08);
}

.investments-map__container {
  width: 100%;
  height: 650px;
  background-color: var(--color-background);
}

@media (max-width: 991px) {
  .investments-map__container {
    height: 560px;
  }
}

@media (max-width: 767px) {
  .investments-map {
    padding: 8px;
  }

  .investments-map__container {
    height: 480px;
  }
}

@media (max-width: 479px) {
  .investments-map__container {
    height: 400px;
  }
}
</style>
