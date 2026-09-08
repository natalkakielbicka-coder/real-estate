<script setup>
import { computed, ref, nextTick, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { investments } from '../data/investments'
import { apartments } from '../data/apartments'
import { buildingPlans } from '../data/buildingPlans'
import { floorPlans } from '../data/floorPlans'
import ApartmentGrid from '../components/ApartmentGrid.vue'
import BuildingFloorSelector from '../components/BuildingFloorSelector.vue'
import FloorPlanSelector from '../components/FloorPlanSelector.vue'
import { getInvestmentStatusCounts } from '../utils/investmentHelpers'
import { getOffersLabel } from '../utils/apartmentFormatters'

const route = useRoute()

const selectedStatus = ref('all')
const selectedFloorNumber = ref(null)
const apartmentsSection = ref(null)

const investment = computed(() => {
  return investments.find((item) => {
    return item.id === route.params.id
  })
})

watchEffect(() => {
  if (!investment.value) {
    return
  }

  document.title = `${investment.value.name} - Real Estate`
})

const investmentApartments = computed(() => {
  return apartments.filter((apartment) => {
    return apartment.investmentId === route.params.id
  })
})

const statusCounts = computed(() => {
  return getInvestmentStatusCounts(apartments, route.params.id)
})

const displayedApartments = computed(() => {
  return investmentApartments.value.filter((apartment) => {
    const matchesFloor =
      selectedFloorNumber.value === null ||
      apartment.floor === selectedFloorNumber.value

    const matchesStatus =
      selectedStatus.value === 'all' ||
      apartment.status === selectedStatus.value

    return matchesFloor && matchesStatus
  })
})

const buildingPlan = computed(() => {
  return buildingPlans.find((plan) => {
    return plan.investmentId === route.params.id
  })
})

const selectedFloorPlan = computed(() => {
  if (selectedFloorNumber.value === null) {
    return null
  }

  return floorPlans.find((plan) => {
    return (
      plan.investmentId === route.params.id &&
      plan.building === buildingPlan.value?.building &&
      plan.floor === selectedFloorNumber.value
    )
  })
})

const handleFloorSelect = async (floor) => {
  selectedFloorNumber.value = floor?.floor ?? null

  await nextTick()

  apartmentsSection.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

const resetApartmentFilters = () => {
  selectedStatus.value = 'all'
}

const selectedFloorLabel = computed(() => {
  if (selectedFloorNumber.value === null) {
    return null
  }

  if (selectedFloorNumber.value === 0) {
    return 'Parter'
  }

  return `${selectedFloorNumber.value}. piętro`
})

const clearFloorSelection = () => {
  selectedFloorNumber.value = null
  selectedStatus.value = 'all'
}
</script>

<template>
  <main class="pt-[88px]">
    <section
      v-if="investment"
      class="relative min-h-[620px] overflow-hidden bg-brand py-[clamp(70px,10vw,140px)] text-white max-sm:min-h-[560px]"
    >
      <img
        class="absolute top-0 right-0 h-full w-full object-cover md:w-[55%]"
        :src="investment.image"
        :alt="`Wizualizacja inwestycji ${investment.name}`"
      />

      <div class="investment-details__hero-overlay"></div>

      <div class="container relative z-[2]">
        <RouterLink
          class="mb-[70px] inline-block text-xs text-white/65 transition-colors hover:text-gold"
          to="/inwestycje"
        >
          ← Wszystkie inwestycje
        </RouterLink>

        <p
          class="mb-4 text-[11px] font-bold tracking-[0.14em] text-gold uppercase"
        >
          {{ investment.city }} · {{ investment.district }}
        </p>

        <h1 class="mb-5 max-w-[850px] text-[clamp(52px,8vw,96px)] text-white">
          {{ investment.name }}
        </h1>

        <p class="mb-0 text-[17px] text-white/65">
          {{ investment.address }}
        </p>

        <div
          class="mt-[60px] flex flex-wrap gap-[18px] max-xs:mt-10 max-xs:grid max-xs:grid-cols-3 max-xs:gap-[7px]"
        >
          <div
            class="flex min-w-[145px] items-center gap-3 border border-white/16 px-[22px] py-[18px] max-xs:min-w-0 max-xs:flex-col max-xs:items-start max-xs:px-2.5 max-xs:py-3.5"
          >
            <strong
              class="font-display text-[34px] leading-none font-normal text-gold max-xs:text-[28px]"
            >
              {{ statusCounts.available }}
            </strong>

            <span
              class="text-[9px] font-bold tracking-[0.08em] text-white/68 uppercase max-xs:text-[7px]"
            >
              Dostępne
            </span>
          </div>

          <div
            class="flex min-w-[145px] items-center gap-3 border border-white/16 px-[22px] py-[18px] max-xs:min-w-0 max-xs:flex-col max-xs:items-start max-xs:px-2.5 max-xs:py-3.5"
          >
            <strong
              class="font-display text-[34px] leading-none font-normal text-gold max-xs:text-[28px]"
            >
              {{ statusCounts.reserved }}
            </strong>

            <span
              class="text-[9px] font-bold tracking-[0.08em] text-white/68 uppercase max-xs:text-[7px]"
            >
              Rezerwacja
            </span>
          </div>

          <div
            class="flex min-w-[145px] items-center gap-3 border border-white/16 px-[22px] py-[18px] max-xs:min-w-0 max-xs:flex-col max-xs:items-start max-xs:px-2.5 max-xs:py-3.5"
          >
            <strong
              class="font-display text-[34px] leading-none font-normal text-gold max-xs:text-[28px]"
            >
              {{ statusCounts.sold }}
            </strong>

            <span
              class="text-[9px] font-bold tracking-[0.08em] text-white/68 uppercase max-xs:text-[7px]"
            >
              Sprzedane
            </span>
          </div>
        </div>
      </div>
    </section>

    <section
      v-else
      class="container py-[120px] text-center"
    >
      <h1 class="mb-8">Nie znaleziono inwestycji</h1>

      <RouterLink
        class="inline-flex bg-brand px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-light"
        to="/inwestycje"
      >
        Wróć do inwestycji
      </RouterLink>
    </section>

    <section
      v-if="investment"
      class="bg-panel py-[clamp(70px,9vw,120px)]"
    >
      <div
        class="container grid grid-cols-1 items-start gap-[clamp(50px,8vw,110px)] md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
      >
        <div>
          <p
            class="mb-4 text-[10px] font-bold tracking-[0.13em] text-gold uppercase"
          >
            O inwestycji
          </p>

          <h2 class="mb-[26px] text-[clamp(38px,5vw,58px)]">
            Przestrzeń zaprojektowana do życia
          </h2>

          <p class="mb-0 max-w-[560px] text-base leading-[1.8] text-muted">
            {{ investment.description }}
          </p>
        </div>

        <div class="grid grid-cols-1 xs:grid-cols-2">
          <div
            v-for="(feature, index) in investment.features"
            :key="feature"
            class="min-h-[125px] border-t border-[rgba(23,63,53,0.14)] p-6 odd:border-r odd:border-[rgba(23,63,53,0.14)] max-xs:min-h-0 max-xs:odd:border-r-0"
          >
            <span class="mb-5 block font-display text-lg text-gold">
              {{ String(index + 1).padStart(2, '0') }}
            </span>

            <strong class="text-sm font-semibold text-brand">
              {{ feature }}
            </strong>
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="buildingPlan"
      class="bg-[#f3f1eb] py-[clamp(60px,8vw,110px)]"
    >
      <div class="container">
        <BuildingFloorSelector
          :plan="buildingPlan"
          :apartments="investmentApartments"
          :selected-floor-number="selectedFloorNumber"
          @select-floor="handleFloorSelect"
        />
      </div>
    </section>

    <section
      v-if="investment"
      ref="apartmentsSection"
      class="scroll-mt-[88px] py-[clamp(60px,8vw,110px)]"
    >
      <div class="container">
        <FloorPlanSelector
          v-if="selectedFloorPlan"
          class="mb-[clamp(50px,7vw,90px)]"
          :floor-plan="selectedFloorPlan"
          :visible-apartments="displayedApartments"
          @reset-filters="resetApartmentFilters"
        />

        <div
          class="mb-10 flex items-end justify-between gap-[30px] max-sm:flex-col max-sm:items-start"
        >
          <div>
            <p
              class="mb-2.5 text-[10px] font-bold tracking-[0.12em] text-gold uppercase"
            >
              Dostępne lokale
            </p>

            <h2 class="mb-0 text-[clamp(34px,5vw,52px)]">
              Mieszkania w tej inwestycji
            </h2>
          </div>

          <div
            class="flex items-center gap-3 max-sm:flex-wrap max-xs:items-start"
          >
            <span
              v-if="selectedFloorLabel"
              class="bg-brand px-[11px] py-2 text-[9px] font-bold tracking-[0.07em] text-white uppercase"
            >
              {{ selectedFloorLabel }}
            </span>

            <button
              v-if="selectedFloorLabel"
              class="border border-[rgba(23,63,53,0.18)] bg-transparent px-[11px] py-2 text-[9px] font-bold tracking-[0.07em] text-brand uppercase transition-colors hover:bg-brand hover:text-white"
              type="button"
              @click="clearFloorSelection"
            >
              Wyczyść wybór
            </button>

            <strong
              class="text-[11px] font-bold tracking-[0.08em] text-muted uppercase"
            >
              {{ displayedApartments.length }}
              {{ getOffersLabel(displayedApartments.length) }}
            </strong>
          </div>
        </div>

        <div class="mb-8 flex flex-wrap gap-2">
          <button
            class="flex items-center gap-[9px] border border-[rgba(23,63,53,0.16)] px-[15px] py-[11px] text-[10px] font-bold tracking-[0.05em] uppercase transition-colors"
            :class="
              selectedStatus === 'all'
                ? 'bg-brand text-white'
                : 'bg-transparent text-brand hover:bg-brand hover:text-white'
            "
            type="button"
            @click="selectedStatus = 'all'"
          >
            Wszystkie

            <span
              class="grid h-5 min-w-5 place-items-center rounded-full text-[9px]"
              :class="selectedStatus === 'all' ? 'bg-white/16' : 'bg-brand/10'"
            >
              {{ investmentApartments.length }}
            </span>
          </button>

          <button
            class="flex items-center gap-[9px] border border-[rgba(23,63,53,0.16)] px-[15px] py-[11px] text-[10px] font-bold tracking-[0.05em] uppercase transition-colors"
            :class="
              selectedStatus === 'available'
                ? 'bg-brand text-white'
                : 'bg-transparent text-brand hover:bg-brand hover:text-white'
            "
            type="button"
            @click="selectedStatus = 'available'"
          >
            Dostępne

            <span
              class="grid h-5 min-w-5 place-items-center rounded-full text-[9px]"
              :class="
                selectedStatus === 'available' ? 'bg-white/16' : 'bg-brand/10'
              "
            >
              {{ statusCounts.available }}
            </span>
          </button>

          <button
            class="flex items-center Turnstile gap-[9px] border border-[rgba(23,63,53,0.16)] px-[15px] py-[11px] text-[10px] font-bold tracking-[0.05em] uppercase transition-colors"
            :class="
              selectedStatus === 'reserved'
                ? 'bg-brand text-white'
                : 'bg-transparent text-brand hover:bg-brand hover:text-white'
            "
            type="button"
            @click="selectedStatus = 'reserved'"
          >
            Rezerwacja

            <span
              class="grid h-5 min-w-5 place-items-center rounded-full text-[9px]"
              :class="
                selectedStatus === 'reserved' ? 'bg-white/16' : 'bg-brand/10'
              "
            >
              {{ statusCounts.reserved }}
            </span>
          </button>

          <button
            class="flex items-center gap-[9px] border border-[rgba(23,63,53,0.16)] px-[15px] py-[11px] text-[10px] font-bold tracking-[0.05em] uppercase transition-colors"
            :class="
              selectedStatus === 'sold'
                ? 'bg-brand text-white'
                : 'bg-transparent text-brand hover:bg-brand hover:text-white'
            "
            type="button"
            @click="selectedStatus = 'sold'"
          >
            Sprzedane

            <span
              class="grid h-5 min-w-5 place-items-center rounded-full text-[9px]"
              :class="selectedStatus === 'sold' ? 'bg-white/16' : 'bg-brand/10'"
            >
              {{ statusCounts.sold }}
            </span>
          </button>
        </div>

        <ApartmentGrid
          v-if="displayedApartments.length"
          :apartments="displayedApartments"
        />

        <p
          v-else
          class="bg-panel px-[25px] py-[50px] text-center text-muted"
        >
          Brak mieszkań z wybranym statusem.
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.investment-details__hero-overlay {
  position: absolute;
  z-index: 1;
  inset: 0;
  background: linear-gradient(
    90deg,
    var(--color-primary) 0%,
    var(--color-primary) 42%,
    rgba(23, 63, 53, 0.88) 56%,
    rgba(23, 63, 53, 0.12) 100%
  );
}

@media (max-width: 991px) {
  .investment-details__hero-overlay {
    background: linear-gradient(
      90deg,
      rgba(23, 63, 53, 0.96) 0%,
      rgba(23, 63, 53, 0.8) 65%,
      rgba(23, 63, 53, 0.5) 100%
    );
  }
}

@media (max-width: 767px) {
  .investment-details__hero-overlay {
    background: rgba(23, 63, 53, 0.78);
  }
}
</style>
