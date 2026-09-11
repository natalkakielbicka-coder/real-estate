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
  },
  selectedFloorNumber: {
    type: [Number, String],
    default: null
  }
})

const emit = defineEmits(['select-floor'])

const hoveredFloor = ref(null)

const tooltipPosition = ref({
  x: 0,
  y: 0
})

const tooltipOnLeft = ref(false)
const tooltipBelow = ref(false)

const moveTooltip = (event) => {
  const imageRect = event.currentTarget.getBoundingClientRect()
  const cursorX = event.clientX - imageRect.left
  const cursorY = event.clientY - imageRect.top

  tooltipPosition.value = {
    x: cursorX,
    y: cursorY
  }

  tooltipOnLeft.value = cursorX > imageRect.width - 230
  tooltipBelow.value = cursorY < 100
}

const isFloorSelected = (floorNumber) => {
  if (props.selectedFloorNumber === null) {
    return false
  }

  return Number(props.selectedFloorNumber) === Number(floorNumber)
}

const selectedFloorLabel = computed(() => {
  if (props.selectedFloorNumber === null) {
    return 'Nie wybrano piętra'
  }

  const selectedFloor = props.plan.floors.find((floor) => {
    return isFloorSelected(floor.floor)
  })

  return selectedFloor?.label ?? 'Nie wybrano piętra'
})

const hoveredFloorApartmentsCount = computed(() => {
  if (!hoveredFloor.value) {
    return 0
  }

  return props.apartments.filter((apartment) => {
    return Number(apartment.floor) === Number(hoveredFloor.value.floor)
  }).length
})

const selectFloor = (floor) => {
  const isAlreadySelected = isFloorSelected(floor.floor)

  emit('select-floor', isAlreadySelected ? null : floor)
}

const getFloorLabel = (floorNumber) => {
  if (floorNumber === 0) {
    return 'parter'
  }

  return `${floorNumber}. piętro`
}
</script>

<template>
  <div
    class="bg-panel p-[clamp(22px,4vw,42px)] shadow-[0_14px_45px_rgba(23,63,53,0.08)] max-xs:p-[18px]"
  >
    <div
      class="mb-[30px] flex items-end justify-between gap-[30px] max-sm:flex-col max-sm:items-start"
    >
      <div>
        <p
          class="mb-2 text-[10px] font-bold tracking-[0.12em] text-gold uppercase"
        >
          Wybierz lokal
        </p>

        <h2 class="mb-0 text-[clamp(32px,4vw,48px)]">
          {{ plan.name }}
        </h2>
      </div>

      <div class="flex flex-col items-end gap-[5px] max-sm:items-start">
        <span
          class="text-[8px] font-bold tracking-[0.1em] text-muted uppercase"
        >
          Wybrane piętro
        </span>

        <strong class="font-display text-[22px] font-normal text-brand">
          {{ selectedFloorLabel }}
        </strong>
      </div>
    </div>

    <div
      class="relative overflow-hidden bg-[#e8ebe8]"
      @mouseleave="hoveredFloor = null"
      @mousemove="moveTooltip"
    >
      <img
        class="block h-auto w-full"
        :src="plan.image"
        :alt="`Wizualizacja ${plan.name}`"
      />

      <svg
        class="absolute inset-0 h-full w-full"
        :viewBox="plan.viewBox"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Wybór piętra budynku"
      >
        <polygon
          v-for="floor in plan.floors"
          :key="floor.floor"
          class="building-floor cursor-pointer"
          :class="{
            'building-floor--selected': isFloorSelected(floor.floor)
          }"
          :points="floor.points"
          tabindex="0"
          role="button"
          :aria-label="`Wybierz ${getFloorLabel(floor.floor)}`"
          @mouseenter="hoveredFloor = floor"
          @mouseleave="hoveredFloor = null"
          @focus="hoveredFloor = floor"
          @blur="hoveredFloor = null"
          @click="selectFloor(floor)"
          @keydown.enter.prevent="selectFloor(floor)"
          @keydown.space.prevent="selectFloor(floor)"
        />
      </svg>

      <div
        v-if="hoveredFloor"
        class="pointer-events-none absolute z-2 box-border flex w-[130px] translate-x-4 translate-y-[calc(-100%_-_16px)] flex-col gap-[5px] bg-brand px-4 py-[13px] text-white shadow-[0_12px_30px_rgba(23,63,53,0.22)]"
        :class="{
          'translate-x-[calc(-100%_-_16px)]': tooltipOnLeft,
          'translate-y-4': tooltipBelow
        }"
        :style="{
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`
        }"
      >
        <strong class="font-display text-lg font-normal">
          {{ hoveredFloor.label }}
        </strong>

        <span class="text-[9px] tracking-[0.04em] text-white/68 uppercase">
          Liczba mieszkań: {{ hoveredFloorApartmentsCount }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.building-floor {
  fill: rgba(199, 157, 98, 0);
  stroke: rgba(255, 255, 255, 0);
  stroke-width: 5;
  transition:
    fill 250ms ease,
    stroke 250ms ease;
}

.building-floor:hover,
.building-floor:focus {
  fill: rgba(199, 157, 98, 0.3);
  stroke: rgba(255, 255, 255, 0.9);
  outline: none;
}

.building-floor.building-floor--selected {
  fill: rgba(199, 157, 98, 0.48);
  stroke: #fff;
}
</style>
