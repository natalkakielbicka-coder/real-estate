<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apartments } from '../data/apartments'
import { apartmentStatusLabels } from '../constants/apartmentStatuses'
import { getFloorLabel, formatPrice } from '../utils/apartmentFormatters'

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

const emit = defineEmits(['reset-filters'])

const router = useRouter()

const activeApartment = ref(null)

const apartmentLabelPositions = [
  { x: 410, y: 285 },
  { x: 1125, y: 285 },
  { x: 410, y: 700 },
  { x: 1125, y: 700 }
]

const tooltipPosition = ref({
  x: 0,
  y: 0
})

const tooltipBelowCursor = ref(false)

const mappedAreas = computed(() => {
  return props.floorPlan.apartmentAreas
    .map((area, index) => {
      const apartment = apartments.find((item) => {
        return item.id === area.apartmentId
      })

      const matchesFilters = props.visibleApartments.some((item) => {
        return item.id === area.apartmentId
      })

      return {
        ...area,
        apartment,
        matchesFilters,
        labelPosition: apartmentLabelPositions[index]
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

const visiblePlanApartmentsCount = computed(() => {
  return mappedAreas.value.filter((area) => {
    return area.matchesFilters
  }).length
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
          class="mb-[7px] text-[10px] font-bold tracking-[0.12em] text-gold uppercase"
        >
          Wybierz mieszkanie
        </p>

        <h2 class="mb-0 text-[clamp(30px,4vw,46px)]">
          {{ floorPlan.name }}
        </h2>
      </div>

      <div class="flex flex-wrap gap-x-5 gap-y-3 max-xs:flex-col max-xs:gap-2">
        <span
          class="flex items-center gap-[7px] text-[10px] font-semibold text-muted"
        >
          <i class="h-[9px] w-[9px] shrink-0 rounded-full bg-available"></i>

          Dostępne

          <strong
            class="grid h-5 min-w-5 place-items-center rounded-[10px] bg-page px-[5px] text-[9px] text-brand"
          >
            {{ planStatusCounts.available }}
          </strong>
        </span>

        <span
          class="flex items-center gap-[7px] text-[10px] font-semibold text-muted"
        >
          <i class="h-[9px] w-[9px] shrink-0 rounded-full bg-reserved"></i>

          Rezerwacja

          <strong
            class="grid h-5 min-w-5 place-items-center rounded-[10px] bg-page px-[5px] text-[9px] text-brand"
          >
            {{ planStatusCounts.reserved }}
          </strong>
        </span>

        <span
          class="flex items-center gap-[7px] text-[10px] font-semibold text-muted"
        >
          <i class="h-[9px] w-[9px] shrink-0 rounded-full bg-sold"></i>

          Sprzedane

          <strong
            class="grid h-5 min-w-5 place-items-center rounded-[10px] bg-page px-[5px] text-[9px] text-brand"
          >
            {{ planStatusCounts.sold }}
          </strong>
        </span>
      </div>
    </div>

    <div class="relative overflow-hidden bg-[#f5f3ee] max-sm:overflow-x-auto">
      <img
        class="block h-auto w-full max-sm:min-w-[720px]"
        :src="floorPlan.image"
        :alt="`Rzut ${floorPlan.name}`"
      />

      <svg
        class="absolute inset-0 h-full w-full max-sm:min-w-[720px]"
        :viewBox="floorPlan.viewBox"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Interaktywny rzut mieszkań"
      >
        <polygon
          v-for="area in mappedAreas"
          :key="area.apartmentId"
          class="cursor-pointer stroke-[rgba(255,255,255,0.95)] [stroke-width:5] transition-[fill-opacity,stroke-width] duration-250 hover:[fill-opacity:0.58] hover:[stroke-width:8] focus:[fill-opacity:0.58] focus:[stroke-width:8] focus:outline-none"
          :class="[
            {
              'fill-available [fill-opacity:0.2]':
                area.apartment.status === 'available',

              'fill-reserved [fill-opacity:0.25]':
                area.apartment.status === 'reserved',

              'fill-sold [fill-opacity:0.32]': area.apartment.status === 'sold',

              'pointer-events-none cursor-not-allowed fill-white [fill-opacity:0.72] stroke-[rgba(146,152,150,0.35)]':
                !area.matchesFilters
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

        <text
          v-for="area in mappedAreas"
          :key="`label-${area.apartmentId}`"
          class="pointer-events-none fill-brand font-display text-[46px]"
          :class="{ 'opacity-35': !area.matchesFilters }"
          :x="area.labelPosition.x"
          :y="area.labelPosition.y"
          text-anchor="middle"
          dominant-baseline="middle"
          aria-hidden="true"
        >
          {{ area.apartment.number }}
        </text>
      </svg>

      <div
        v-if="visiblePlanApartmentsCount === 0"
        class="absolute inset-0 z-3 flex flex-col items-center justify-center bg-[rgba(245,243,238,0.9)] p-[30px] text-center backdrop-blur-[3px]"
      >
        <span
          class="mb-[18px] grid h-[70px] w-[70px] place-items-center rounded-full bg-white font-display text-[38px] text-gold"
        >
          0
        </span>

        <strong
          class="mb-[7px] font-display text-[clamp(22px,3vw,32px)] font-normal text-brand"
        >
          Brak mieszkań na tym rzucie
        </strong>

        <p class="mb-0 text-[11px] text-muted">
          Zmień lub wyczyść wybrane filtry.
        </p>

        <button
          class="group mt-5 inline-flex min-h-11 items-center gap-3 border-0 bg-brand px-[17px] text-[10px] font-bold text-white transition-colors hover:bg-brand-light"
          type="button"
          @click="emit('reset-filters')"
        >
          Wyczyść filtry

          <span
            class="text-[17px] transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          >
            →
          </span>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="activeApartment"
        class="pointer-events-none fixed z-[1000] w-[245px] -translate-x-1/2 bg-brand p-[18px] text-white shadow-[0_15px_40px_rgba(23,63,53,0.25)] after:absolute after:left-1/2 after:h-[14px] after:w-[14px] after:-translate-x-1/2 after:rotate-45 after:bg-brand after:content-['']"
        :class="
          tooltipBelowCursor
            ? 'translate-y-[18px] after:-top-[7px]'
            : 'translate-y-[calc(-100%_-_16px)] after:-bottom-[7px]'
        "
        :style="{
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`
        }"
      >
        <div class="mb-[14px] flex items-start justify-between gap-3">
          <strong class="font-display text-xl font-normal">
            Mieszkanie {{ activeApartment.number }}
          </strong>

          <span
            class="px-[7px] py-[5px] text-[7px] font-bold uppercase"
            :class="{
              'bg-available': activeApartment.status === 'available',

              'bg-reserved': activeApartment.status === 'reserved',

              'bg-sold': activeApartment.status === 'sold'
            }"
          >
            {{ apartmentStatusLabels[activeApartment.status] }}
          </span>
        </div>

        <div class="mb-[14px] flex gap-3 border-y border-white/18 py-[11px]">
          <span class="text-[9px]"> {{ activeApartment.rooms }} pokoje </span>

          <span class="text-[9px]"> {{ activeApartment.area }} m² </span>

          <span class="text-[9px]">
            {{ getFloorLabel(activeApartment.floor) }}
          </span>
        </div>

        <p class="mb-[5px] font-display text-[22px] text-white">
          {{ formatPrice(activeApartment.price) }} zł
        </p>

        <small class="text-[8px] text-white/60">
          Kliknij, aby zobaczyć mieszkanie
        </small>
      </div>
    </Teleport>
  </div>
</template>
