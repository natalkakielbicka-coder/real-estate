<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { apartments } from '../data/apartments'

const props = defineProps({
  floorPlan: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const mappedAreas = computed(() => {
  return props.floorPlan.apartmentAreas
    .map((area) => {
      const apartment = apartments.find((item) => {
        return item.id === area.apartmentId
      })

      return {
        ...area,
        apartment
      }
    })
    .filter((area) => area.apartment)
})

const openApartment = (apartment) => {
  router.push(`/mieszkania/${apartment.slug}`)
}
</script>

<template>
  <div class="floor-selector">
    <div class="floor-selector__header">
      <div>
        <p>Wybierz mieszkanie</p>
        <h2>{{ floorPlan.name }}</h2>
      </div>

      <div class="floor-selector__legend">
        <span class="floor-selector__legend-item">
          <i class="floor-selector__dot floor-selector__dot--available"></i>
          Dostępne
        </span>

        <span class="floor-selector__legend-item">
          <i class="floor-selector__dot floor-selector__dot--reserved"></i>
          Rezerwacja
        </span>

        <span class="floor-selector__legend-item">
          <i class="floor-selector__dot floor-selector__dot--sold"></i>
          Sprzedane
        </span>
      </div>
    </div>

    <div class="floor-selector__plan">
      <img
        :src="floorPlan.image"
        :alt="`Rzut ${floorPlan.name}`"
      />

      <svg
        class="floor-selector__areas"
        :viewBox="floorPlan.viewBox"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Interaktywny rzut mieszkań"
      >
        <polygon
          v-for="area in mappedAreas"
          :key="area.apartmentId"
          class="floor-selector__area"
          :class="`floor-selector__area--${area.apartment.status}`"
          :points="area.points"
          tabindex="0"
          role="link"
          :aria-label="`Mieszkanie ${area.apartment.number}, ${area.apartment.area} metrów kwadratowych`"
          @click="openApartment(area.apartment)"
          @keydown.enter="openApartment(area.apartment)"
          @keydown.space.prevent="openApartment(area.apartment)"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.floor-selector {
  padding: clamp(22px, 4vw, 42px);
  background-color: var(--color-surface);
  box-shadow: 0 14px 45px rgba(23, 63, 53, 0.08);
}

.floor-selector__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 30px;
  gap: 30px;
}

.floor-selector__header p {
  margin-bottom: 7px;
  color: var(--color-accent);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.floor-selector__header h2 {
  margin-bottom: 0;
  font-size: clamp(30px, 4vw, 46px);
}

.floor-selector__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
}

.floor-selector__legend-item {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 600;
}

.floor-selector__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.floor-selector__dot--available {
  background-color: #3d806d;
}

.floor-selector__dot--reserved {
  background-color: #c28b3f;
}

.floor-selector__dot--sold {
  background-color: #929896;
}

.floor-selector__plan {
  position: relative;
  overflow: hidden;
  background-color: #f5f3ee;
}

.floor-selector__plan img {
  display: block;
  width: 100%;
  height: auto;
}

.floor-selector__areas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.floor-selector__area {
  stroke: rgba(255, 255, 255, 0.95);
  stroke-width: 5;
  cursor: pointer;
  transition:
    fill-opacity 0.25s ease,
    stroke-width 0.25s ease;
}

.floor-selector__area--available {
  fill: #3d806d;
  fill-opacity: 0.2;
}

.floor-selector__area--reserved {
  fill: #c28b3f;
  fill-opacity: 0.25;
}

.floor-selector__area--sold {
  fill: #929896;
  fill-opacity: 0.32;
}

.floor-selector__area:hover,
.floor-selector__area:focus {
  fill-opacity: 0.58;
  stroke-width: 8;
  outline: none;
}

@media (max-width: 767px) {
  .floor-selector__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .floor-selector__plan {
    overflow-x: auto;
  }

  .floor-selector__plan img,
  .floor-selector__areas {
    min-width: 720px;
  }
}

@media (max-width: 479px) {
  .floor-selector {
    padding: 18px;
  }

  .floor-selector__legend {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
