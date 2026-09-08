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
  <main class="investment-details">
    <section
      v-if="investment"
      class="investment-details__hero"
    >
      <img
        class="investment-details__hero-image"
        :src="investment.image"
        :alt="`Wizualizacja inwestycji ${investment.name}`"
      />

      <div class="investment-details__hero-overlay"></div>

      <div class="investment-details__hero-content container">
        <RouterLink
          class="investment-details__back"
          to="/inwestycje"
        >
          ← Wszystkie inwestycje
        </RouterLink>

        <p class="investment-details__location">
          {{ investment.city }} · {{ investment.district }}
        </p>

        <h1>{{ investment.name }}</h1>

        <p class="investment-details__address">
          {{ investment.address }}
        </p>

        <div class="investment-details__stats">
          <div class="investment-details__stat">
            <strong>{{ statusCounts.available }}</strong>
            <span>Dostępne</span>
          </div>

          <div class="investment-details__stat">
            <strong>{{ statusCounts.reserved }}</strong>
            <span>Rezerwacja</span>
          </div>

          <div class="investment-details__stat">
            <strong>{{ statusCounts.sold }}</strong>
            <span>Sprzedane</span>
          </div>
        </div>
      </div>
    </section>

    <section
      v-else
      class="investment-details__not-found container"
    >
      <h1>Nie znaleziono inwestycji</h1>

      <RouterLink to="/inwestycje"> Wróć do inwestycji </RouterLink>
    </section>

    <section
      v-if="investment"
      class="investment-details__about"
    >
      <div class="investment-details__about-layout container">
        <div class="investment-details__about-content">
          <p class="investment-details__eyebrow">O inwestycji</p>

          <h2>Przestrzeń zaprojektowana do życia</h2>

          <p class="investment-details__description">
            {{ investment.description }}
          </p>
        </div>

        <div class="investment-details__features">
          <div
            v-for="(feature, index) in investment.features"
            :key="feature"
            class="investment-details__feature"
          >
            <span>
              {{ String(index + 1).padStart(2, '0') }}
            </span>

            <strong>{{ feature }}</strong>
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="buildingPlan"
      class="investment-details__building"
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
      class="investment-details__apartments"
    >
      <div class="container">
        <FloorPlanSelector
          v-if="selectedFloorPlan"
          class="investment-details__floor-plan"
          :floor-plan="selectedFloorPlan"
          :visible-apartments="displayedApartments"
          @reset-filters="resetApartmentFilters"
        />

        <div class="investment-details__apartments-header">
          <div>
            <p>Dostępne lokale</p>
            <h2>Mieszkania w tej inwestycji</h2>
          </div>

          <div class="investment-details__results-summary">
            <span v-if="selectedFloorLabel">
              {{ selectedFloorLabel }}
            </span>

            <button
              v-if="selectedFloorLabel"
              type="button"
              @click="clearFloorSelection"
            >
              Wyczyść wybór
            </button>

            <strong>
              {{ displayedApartments.length }}
              ofert
            </strong>
          </div>
        </div>

        <div class="investment-details__filters">
          <button
            type="button"
            :class="{ active: selectedStatus === 'all' }"
            @click="selectedStatus = 'all'"
          >
            Wszystkie
            <span>{{ investmentApartments.length }}</span>
          </button>

          <button
            type="button"
            :class="{ active: selectedStatus === 'available' }"
            @click="selectedStatus = 'available'"
          >
            Dostępne
            <span>{{ statusCounts.available }}</span>
          </button>

          <button
            type="button"
            :class="{ active: selectedStatus === 'reserved' }"
            @click="selectedStatus = 'reserved'"
          >
            Rezerwacja
            <span>{{ statusCounts.reserved }}</span>
          </button>

          <button
            type="button"
            :class="{ active: selectedStatus === 'sold' }"
            @click="selectedStatus = 'sold'"
          >
            Sprzedane
            <span>{{ statusCounts.sold }}</span>
          </button>
        </div>

        <ApartmentGrid
          v-if="displayedApartments.length"
          :apartments="displayedApartments"
        />

        <p
          v-else
          class="investment-details__empty"
        >
          Brak mieszkań z wybranym statusem.
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.investment-details {
  padding-top: 88px;
}

.investment-details__hero {
  position: relative;
  min-height: 620px;
  overflow: hidden;
  padding-block: clamp(70px, 10vw, 140px);
  color: #ffffff;
  background-color: var(--color-primary);
}

.investment-details__hero-image {
  position: absolute;
  top: 0;
  right: 0;
  width: 55%;
  height: 100%;
  object-fit: cover;
}

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

.investment-details__hero-content {
  position: relative;
  z-index: 2;
}

.investment-details__back {
  display: inline-block;
  margin-bottom: 70px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 12px;
}

.investment-details__back:hover {
  color: var(--color-accent);
}

.investment-details__location {
  margin-bottom: 16px;
  color: var(--color-accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.investment-details h1 {
  max-width: 850px;
  margin-bottom: 20px;
  color: #ffffff;
  font-size: clamp(52px, 8vw, 96px);
}

.investment-details__address {
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.65);
  font-size: 17px;
}

.investment-details__not-found {
  padding-block: 120px;
}

.investment-details__apartments {
  padding-block: clamp(60px, 8vw, 110px);
  scroll-margin-top: 88px;
}

.investment-details__apartments-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 40px;
  gap: 30px;
}

.investment-details__apartments-header p {
  margin-bottom: 10px;
  color: var(--color-accent);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.investment-details__apartments-header h2 {
  margin-bottom: 0;
  font-size: clamp(34px, 5vw, 52px);
}

.investment-details__results-summary {
  display: flex;
  align-items: center;
  gap: 12px;
}

.investment-details__results-summary span {
  padding: 8px 11px;
  color: #ffffff;
  background-color: var(--color-primary);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.investment-details__results-summary strong {
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.investment-details__results-summary button {
  padding: 8px 11px;
  border: 1px solid rgba(23, 63, 53, 0.18);
  color: var(--color-primary);
  background-color: transparent;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  cursor: pointer;
}

.investment-details__results-summary button:hover {
  color: #ffffff;
  background-color: var(--color-primary);
}

.investment-details__stats {
  display: flex;
  flex-wrap: wrap;
  margin-top: 60px;
  gap: 18px;
}

.investment-details__stat {
  display: flex;
  min-width: 145px;
  align-items: center;
  padding: 18px 22px;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
}

.investment-details__stat strong {
  color: var(--color-accent);
  font-family: var(--font-heading);
  font-size: 34px;
  font-weight: 400;
  line-height: 1;
}

.investment-details__stat span {
  color: rgba(255, 255, 255, 0.68);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.investment-details__filters {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 32px;
  gap: 8px;
}

.investment-details__filters button {
  display: flex;
  align-items: center;
  padding: 11px 15px;
  gap: 9px;
  border: 1px solid rgba(23, 63, 53, 0.16);
  color: var(--color-primary);
  background-color: transparent;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
}

.investment-details__filters button:hover,
.investment-details__filters button.active {
  color: #ffffff;
  background-color: var(--color-primary);
}

.investment-details__filters span {
  display: grid;
  min-width: 20px;
  height: 20px;
  place-items: center;
  border-radius: 50%;
  background-color: rgba(23, 63, 53, 0.1);
  font-size: 9px;
}

.investment-details__filters button.active span {
  background-color: rgba(255, 255, 255, 0.16);
}

.investment-details__empty {
  padding: 50px 25px;
  text-align: center;
  background-color: var(--color-surface);
}

.investment-details__about {
  padding-block: clamp(70px, 9vw, 120px);
  background-color: var(--color-surface);
}

.investment-details__about-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  align-items: start;
  gap: clamp(50px, 8vw, 110px);
}

.investment-details__eyebrow {
  margin-bottom: 16px;
  color: var(--color-accent);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.investment-details__about h2 {
  margin-bottom: 26px;
  font-size: clamp(38px, 5vw, 58px);
}

.investment-details__description {
  max-width: 560px;
  margin-bottom: 0;
  color: var(--color-text-muted);
  font-size: 16px;
  line-height: 1.8;
}

.investment-details__features {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.investment-details__feature {
  min-height: 125px;
  padding: 24px;
  border-top: 1px solid rgba(23, 63, 53, 0.14);
}

.investment-details__feature:nth-child(odd) {
  border-right: 1px solid rgba(23, 63, 53, 0.14);
}

.investment-details__feature span {
  display: block;
  margin-bottom: 20px;
  color: var(--color-accent);
  font-family: var(--font-heading);
  font-size: 18px;
}

.investment-details__feature strong {
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 600;
}

.investment-details__building {
  padding-block: clamp(60px, 8vw, 110px);
  background-color: #f3f1eb;
}

.investment-details__floor-plan {
  margin-bottom: clamp(50px, 7vw, 90px);
}

@media (max-width: 991px) {
  .investment-details__hero-image {
    width: 100%;
  }

  .investment-details__hero-overlay {
    background: linear-gradient(
      90deg,
      rgba(23, 63, 53, 0.96) 0%,
      rgba(23, 63, 53, 0.8) 65%,
      rgba(23, 63, 53, 0.5) 100%
    );
  }

  .investment-details__about-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .investment-details__apartments-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .investment-details__hero {
    min-height: 560px;
  }

  .investment-details__hero-overlay {
    background: rgba(23, 63, 53, 0.78);
  }

  .investment-details__results-summary {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 479px) {
  .investment-details__stats {
    display: grid;
    margin-top: 40px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 7px;
  }

  .investment-details__stat {
    min-width: 0;
    align-items: flex-start;
    flex-direction: column;
    padding: 14px 10px;
  }

  .investment-details__stat strong {
    font-size: 28px;
  }

  .investment-details__stat span {
    font-size: 7px;
  }

  .investment-details__filters {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .investment-details__filters button {
    justify-content: space-between;
  }

  .investment-details__features {
    grid-template-columns: 1fr;
  }

  .investment-details__feature:nth-child(odd) {
    border-right: 0;
  }

  .investment-details__feature {
    min-height: auto;
    padding-inline: 0;
  }
}
</style>
