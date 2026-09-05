<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apartments } from '../data/apartments'
import { apartmentStatusLabels } from '../constants/apartmentStatuses'

const props = defineProps({
  floorPlan: {
    type: Object,
    required: true
  },
  visibleApartments: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()

const activeApartment = ref(null)

const tooltipPosition = ref({
  x: 0,
  y: 0
})

const tooltipBelowCursor = ref(false)

const mappedAreas = computed(() => {
  return props.floorPlan.apartmentAreas
    .map((area) => {
      const apartment = apartments.find((item) => {
        return item.id === area.apartmentId
      })

      const matchesFilters = props.visibleApartments.some((item) => {
        return item.id === area.apartmentId
      })

      return {
        ...area,
        apartment,
        matchesFilters
      }
    })
    .filter((area) => area.apartment)
})

const planStatusCounts = computed(() => {
  const counts = {
    available: 0,
    reserved: 0,
    sold: 0
  }

  mappedAreas.value.forEach((area) => {
    if (area.matchesFilters) {
      counts[area.apartment.status]++
    }
  })

  return counts
})

const openApartment = (apartment) => {
  router.push(`/mieszkania/${apartment.slug}`)
}

const moveTooltip = (event) => {
  const tooltipWidth = 245
  const screenPadding = 16
  const halfTooltipWidth = tooltipWidth / 2

  const minX = halfTooltipWidth + screenPadding
  const maxX = window.innerWidth - halfTooltipWidth - screenPadding

  tooltipPosition.value = {
    x: Math.min(Math.max(event.clientX, minX), maxX),
    y: event.clientY
  }

  tooltipBelowCursor.value = event.clientY < 210
}

const showTooltip = (apartment, event) => {
  activeApartment.value = apartment
  moveTooltip(event)
}

const hideTooltip = () => {
  activeApartment.value = null
}

const formattedTooltipPrice = computed(() => {
  if (!activeApartment.value) {
    return ''
  }

  return new Intl.NumberFormat('pl-PL').format(activeApartment.value.price)
})
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

          <strong>{{ planStatusCounts.available }}</strong>
        </span>

        <span class="floor-selector__legend-item">
          <i class="floor-selector__dot floor-selector__dot--reserved"></i>

          Rezerwacja

          <strong>{{ planStatusCounts.reserved }}</strong>
        </span>

        <span class="floor-selector__legend-item">
          <i class="floor-selector__dot floor-selector__dot--sold"></i>

          Sprzedane

          <strong>{{ planStatusCounts.sold }}</strong>
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
          :class="[
            `floor-selector__area--${area.apartment.status}`,
            {
              'floor-selector__area--filtered-out': !area.matchesFilters
            }
          ]"
          :points="area.points"
          :tabindex="area.matchesFilters ? 0 : -1"
          role="link"
          :aria-label="`Mieszkanie ${area.apartment.number}, ${area.apartment.area} metrów kwadratowych`"
          @click="area.matchesFilters && openApartment(area.apartment)"
          @keydown.enter="area.matchesFilters && openApartment(area.apartment)"
          @keydown.space.prevent="
            area.matchesFilters && openApartment(area.apartment)
          "
          @mouseenter="
            area.matchesFilters && showTooltip(area.apartment, $event)
          "
          @mousemove="area.matchesFilters && moveTooltip($event)"
          @mouseleave="hideTooltip"
          @blur="hideTooltip"
        />
      </svg>
    </div>

    <Teleport to="body">
      <div
        v-if="activeApartment"
        class="floor-selector__tooltip"
        :class="{
          'floor-selector__tooltip--below': tooltipBelowCursor
        }"
        :style="{
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`
        }"
      >
        <div class="floor-selector__tooltip-heading">
          <strong>Mieszkanie {{ activeApartment.number }}</strong>

          <span :class="`status--${activeApartment.status}`">
            {{ apartmentStatusLabels[activeApartment.status] }}
          </span>
        </div>

        <div class="floor-selector__tooltip-parameters">
          <span>{{ activeApartment.rooms }} pokoje</span>
          <span>{{ activeApartment.area }} m²</span>

          <span>
            {{
              activeApartment.floor === 0
                ? 'Parter'
                : `${activeApartment.floor}. piętro`
            }}
          </span>
        </div>

        <p>{{ formattedTooltipPrice }} zł</p>

        <small>Kliknij, aby zobaczyć mieszkanie</small>
      </div>
    </Teleport>
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

.floor-selector__legend-item strong {
  display: grid;
  min-width: 20px;
  height: 20px;
  padding-inline: 5px;
  place-items: center;
  color: var(--color-primary);
  background-color: var(--color-background);
  font-size: 9px;
  border-radius: 10px;
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

.floor-selector__area--filtered-out {
  fill: #ffffff;
  fill-opacity: 0.72;
  stroke: rgba(146, 152, 150, 0.35);
  cursor: not-allowed;
  pointer-events: none;
}

.floor-selector__tooltip {
  position: fixed;
  z-index: 1000;
  width: 245px;
  padding: 18px;
  color: #ffffff;
  background-color: var(--color-primary);
  box-shadow: 0 15px 40px rgba(23, 63, 53, 0.25);
  pointer-events: none;
  transform: translate(-50%, calc(-100% - 16px));
}

.floor-selector__tooltip::after {
  position: absolute;
  bottom: -7px;
  left: 50%;
  width: 14px;
  height: 14px;
  content: '';
  background-color: var(--color-primary);
  transform: translateX(-50%) rotate(45deg);
}

.floor-selector__tooltip--below {
  transform: translate(-50%, 18px);
}

.floor-selector__tooltip--below::after {
  top: -7px;
  bottom: auto;
}

.floor-selector__tooltip-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
  gap: 12px;
}

.floor-selector__tooltip-heading strong {
  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 400;
}

.floor-selector__tooltip-heading span {
  padding: 5px 7px;
  font-size: 7px;
  font-weight: 700;
  text-transform: uppercase;
}

.floor-selector__tooltip-heading .status--available {
  background-color: #3d806d;
}

.floor-selector__tooltip-heading .status--reserved {
  background-color: #c28b3f;
}

.floor-selector__tooltip-heading .status--sold {
  background-color: #929896;
}

.floor-selector__tooltip-parameters {
  display: flex;
  margin-bottom: 14px;
  padding-block: 11px;
  gap: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
}

.floor-selector__tooltip-parameters span {
  font-size: 9px;
}

.floor-selector__tooltip p {
  margin-bottom: 5px;
  color: #ffffff;
  font-family: var(--font-heading);
  font-size: 22px;
}

.floor-selector__tooltip small {
  color: rgba(255, 255, 255, 0.6);
  font-size: 8px;
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
