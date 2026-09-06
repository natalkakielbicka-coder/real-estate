<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  plan: {
    type: Object,
    required: true
  },
  apartments: {
    type: Array,
    default: () => []
  }
})

console.table(props.apartments)

const emit = defineEmits(['select-floor'])

const hoveredFloor = ref(null)
const selectedFloor = ref(null)

const tooltipPosition = ref({
  x: 0,
  y: 0
})

const tooltipOnLeft = ref(false)

const moveTooltip = (event) => {
  const imageRect = event.currentTarget.getBoundingClientRect()
  const cursorX = event.clientX - imageRect.left
  const cursorY = event.clientY - imageRect.top

  tooltipPosition.value = {
    x: cursorX,
    y: cursorY
  }

  tooltipOnLeft.value = cursorX > imageRect.width - 230
}

const activeLabel = computed(() => {
  if (hoveredFloor.value) {
    return hoveredFloor.value.label
  }

  if (selectedFloor.value) {
    return selectedFloor.value.label
  }

  return 'Najedź na wybrane piętro'
})

const hoveredFloorApartmentsCount = computed(() => {
  if (!hoveredFloor.value) {
    return 0
  }

  return props.apartments.filter((apartment) => {
    return apartment.floor === hoveredFloor.value.floor
  }).length
})

const selectFloor = (floor) => {
  selectedFloor.value = floor
  emit('select-floor', floor)
}
</script>

<template>
  <div class="building-selector">
    <div class="building-selector__header">
      <div>
        <p>Wybierz lokal</p>
        <h2>{{ plan.name }}</h2>
      </div>

      <div class="building-selector__current">
        <span>Wybrane piętro</span>
        <strong>{{ activeLabel }}</strong>
      </div>
    </div>

    <div
      class="building-selector__image"
      @mouseleave="hoveredFloor = null"
      @mousemove="moveTooltip"
    >
      <img
        :src="plan.image"
        :alt="`Wizualizacja ${plan.name}`"
      />

      <svg
        class="building-selector__areas"
        :viewBox="plan.viewBox"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Wybór piętra budynku"
      >
        <polygon
          v-for="floor in plan.floors"
          :key="floor.floor"
          class="building-selector__floor"
          :class="{
            'building-selector__floor--selected':
              selectedFloor?.floor === floor.floor
          }"
          :points="floor.points"
          tabindex="0"
          role="button"
          :aria-label="`Wybierz ${floor.label}`"
          :aria-pressed="selectedFloor?.floor === floor.floor"
          @mouseenter="hoveredFloor = floor"
          @mouseleave="hoveredFloor = null"
          @focus="hoveredFloor = floor"
          @blur="hoveredFloor = null"
          @click="selectFloor(floor)"
          @keydown.enter="selectFloor(floor)"
          @keydown.space.prevent="selectFloor(floor)"
        />
      </svg>

      <div
        v-if="hoveredFloor"
        class="building-selector__tooltip"
        :class="{
          'building-selector__tooltip--left': tooltipOnLeft
        }"
        :style="{
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`
        }"
      >
        <strong>{{ hoveredFloor.label }}</strong>
        <span>Liczba mieszkań: {{ hoveredFloorApartmentsCount }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.building-selector {
  padding: clamp(22px, 4vw, 42px);
  background-color: var(--color-surface);
  box-shadow: 0 14px 45px rgba(23, 63, 53, 0.08);
}

.building-selector__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 30px;
  gap: 30px;
}

.building-selector__header p {
  margin-bottom: 8px;
  color: var(--color-accent);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.building-selector__header h2 {
  margin-bottom: 0;
  font-size: clamp(32px, 4vw, 48px);
}

.building-selector__current {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 5px;
}

.building-selector__current span {
  color: var(--color-text-muted);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.building-selector__current strong {
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: 22px;
  font-weight: 400;
}

.building-selector__image {
  position: relative;
  overflow: hidden;
  background-color: #e8ebe8;
}

.building-selector__image img {
  display: block;
  width: 100%;
  height: auto;
}

.building-selector__areas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.building-selector__floor {
  fill: var(--color-accent);
  fill-opacity: 0;
  stroke: rgba(255, 255, 255, 0);
  stroke-width: 5;
  cursor: pointer;
  transition:
    fill-opacity 0.25s ease,
    stroke 0.25s ease;
}

.building-selector__floor:hover,
.building-selector__floor:focus {
  fill-opacity: 0.3;
  stroke: rgba(255, 255, 255, 0.9);
  outline: none;
}

.building-selector__floor--selected {
  fill-opacity: 0.48;
  stroke: #ffffff;
}

.building-selector__tooltip {
  position: absolute;
  z-index: 2;
  transform: translate(16px, calc(-100% - 16px));
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 13px 16px;
  color: #ffffff;
  background-color: var(--color-primary);
  box-shadow: 0 12px 30px rgba(23, 63, 53, 0.22);
  pointer-events: none;
  width: 130px;
  box-sizing: border-box;
}

.building-selector__tooltip strong {
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 400;
}

.building-selector__tooltip span {
  color: rgba(255, 255, 255, 0.68);
  font-size: 9px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.building-selector__tooltip--left {
  transform: translate(calc(-100% - 16px), calc(-100% - 16px));
}

@media (max-width: 767px) {
  .building-selector__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .building-selector__current {
    align-items: flex-start;
  }
}

@media (max-width: 479px) {
  .building-selector {
    padding: 18px;
  }
}
</style>
