<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ApartmentGrid from '../components/ApartmentGrid.vue'
import ApartmentList from '../components/ApartmentList.vue'
import ApartmentTable from '../components/ApartmentTable.vue'
import FloorPlanSelector from '../components/FloorPlanSelector.vue'
import { floorPlans } from '../data/floorPlans'
import { apartments } from '../data/apartments'

const selectedCities = ref([])
const selectedRooms = ref([])
const selectedStatuses = ref([])
const selectedOutdoorSpaces = ref([])
const onlyWithParking = ref(false)
const onlyWithStorage = ref(false)
const selectedSort = ref('default')

const route = useRoute()
const router = useRouter()

const availableViewModes = ['grid', 'list', 'table', 'plan']

const viewMode = ref(
  availableViewModes.includes(route.query.view) ? route.query.view : 'grid'
)

watch(viewMode, (newViewMode) => {
  router.replace({
    query: {
      ...route.query,
      view: newViewMode === 'grid' ? undefined : newViewMode
    }
  })
})

const outdoorSpaces = [
  {
    value: 'balcony',
    label: 'Balkon'
  },
  {
    value: 'terrace',
    label: 'Taras'
  },
  {
    value: 'garden',
    label: 'Ogródek'
  },
  {
    value: 'loggia',
    label: 'Loggia'
  }
]

const priceFromInput = ref('')
const priceToInput = ref('')
const minPrice = ref(null)
const maxPrice = ref(null)

const applyPriceFilter = () => {
  minPrice.value =
    priceFromInput.value === '' ? null : Number(priceFromInput.value)

  maxPrice.value = priceToInput.value === '' ? null : Number(priceToInput.value)
}

const resetFilters = () => {
  selectedCities.value = []
  selectedRooms.value = []
  selectedStatuses.value = []
  selectedOutdoorSpaces.value = []

  onlyWithParking.value = false
  onlyWithStorage.value = false

  priceFromInput.value = ''
  priceToInput.value = ''

  minPrice.value = null
  maxPrice.value = null
  selectedSort.value = 'default'
}

const cities = [...new Set(apartments.map((apartment) => apartment.city))]

const rooms = [...new Set(apartments.map((apartment) => apartment.rooms))].sort(
  (a, b) => a - b
)

const statuses = [
  {
    value: 'available',
    label: 'Dostępne'
  },
  {
    value: 'reserved',
    label: 'Zarezerwowane'
  },
  {
    value: 'sold',
    label: 'Sprzedane'
  }
]

const getStatusCount = (status) => {
  return apartments.filter((apartment) => {
    return apartment.status === status
  }).length
}

const filteredApartments = computed(() => {
  return apartments.filter((apartment) => {
    const matchesCity =
      selectedCities.value.length === 0 ||
      selectedCities.value.includes(apartment.city)

    const matchesRooms =
      selectedRooms.value.length === 0 ||
      selectedRooms.value.includes(apartment.rooms)

    const matchesStatus =
      selectedStatuses.value.length === 0 ||
      selectedStatuses.value.includes(apartment.status)

    const matchesMinPrice =
      minPrice.value === null || apartment.price >= minPrice.value

    const matchesMaxPrice =
      maxPrice.value === null || apartment.price <= maxPrice.value

    const matchesOutdoorSpace =
      selectedOutdoorSpaces.value.length === 0 ||
      selectedOutdoorSpaces.value.includes(apartment.outdoorSpace.type)

    const matchesParking = !onlyWithParking.value || apartment.parkingSpace

    const matchesStorage = !onlyWithStorage.value || apartment.storageRoom

    return (
      matchesCity &&
      matchesRooms &&
      matchesStatus &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesOutdoorSpace &&
      matchesParking &&
      matchesStorage
    )
  })
})

const sortedApartments = computed(() => {
  const apartmentsToSort = [...filteredApartments.value]

  if (selectedSort.value === 'price-asc') {
    return apartmentsToSort.sort((a, b) => a.price - b.price)
  }

  if (selectedSort.value === 'price-desc') {
    return apartmentsToSort.sort((a, b) => b.price - a.price)
  }

  if (selectedSort.value === 'area-asc') {
    return apartmentsToSort.sort((a, b) => a.area - b.area)
  }

  if (selectedSort.value === 'area-desc') {
    return apartmentsToSort.sort((a, b) => b.area - a.area)
  }

  if (selectedSort.value === 'price-per-meter-asc') {
    return apartmentsToSort.sort((a, b) => {
      const firstPricePerMeter = a.price / a.area
      const secondPricePerMeter = b.price / b.area

      return firstPricePerMeter - secondPricePerMeter
    })
  }

  return apartmentsToSort
})
</script>

<template>
  <main class="apartments-page">
    <section class="apartments-header">
      <div class="container">
        <p class="apartments-header__eyebrow">Oferta mieszkań</p>

        <h1>Znajdź swoje mieszkanie</h1>

        <div class="apartments-header__bottom">
          <p>
            Porównaj dostępne lokale i wybierz przestrzeń dopasowaną do Twoich
            potrzeb.
          </p>

          <div class="apartments-header__count">
            <strong>{{ apartments.length }}</strong>
            <span>dostępnych ofert</span>
          </div>
        </div>
      </div>
    </section>

    <section class="apartments-results">
      <div class="apartments-layout container">
        <aside class="filters-sidebar">
          <div class="filters-sidebar__header">
            <p>Filtry mieszkań</p>

            <span> {{ filteredApartments.length }} ofert </span>
          </div>

          <button
            class="filters-sidebar__reset"
            type="button"
            @click="resetFilters"
          >
            Wyczyść
          </button>

          <fieldset class="filter-group">
            <legend>Miasto</legend>

            <label
              v-for="city in cities"
              :key="city"
              class="filter-checkbox"
            >
              <input
                v-model="selectedCities"
                type="checkbox"
                :value="city"
              />

              <span class="filter-checkbox__mark"></span>
              <span>{{ city }}</span>
            </label>
          </fieldset>
          <fieldset class="filter-group">
            <legend>Liczba pokoi</legend>

            <label
              v-for="room in rooms"
              :key="room"
              class="filter-checkbox"
            >
              <input
                v-model="selectedRooms"
                type="checkbox"
                :value="room"
              />

              <span class="filter-checkbox__mark"></span>

              <span>
                {{ room }}
                {{ room === 1 ? 'pokój' : 'pokoje' }}
              </span>
            </label>
          </fieldset>
          <fieldset class="filter-group">
            <legend>Status mieszkania</legend>

            <label
              v-for="status in statuses"
              :key="status.value"
              class="filter-checkbox"
            >
              <input
                v-model="selectedStatuses"
                type="checkbox"
                :value="status.value"
              />

              <span class="filter-checkbox__mark"></span>

              <span
                class="status-dot"
                :class="`status-dot--${status.value}`"
              ></span>

              <span class="filter-checkbox__label">
                {{ status.label }}
              </span>

              <small class="filter-checkbox__count">
                {{ getStatusCount(status.value) }}
              </small>
            </label>
          </fieldset>
          <fieldset class="filter-group">
            <legend>Przestrzeń dodatkowa</legend>

            <label
              v-for="space in outdoorSpaces"
              :key="space.value"
              class="filter-checkbox"
            >
              <input
                v-model="selectedOutdoorSpaces"
                type="checkbox"
                :value="space.value"
              />

              <span class="filter-checkbox__mark"></span>

              <span class="filter-checkbox__label">
                {{ space.label }}
              </span>
            </label>
          </fieldset>
          <fieldset class="filter-group">
            <legend>Dodatkowe udogodnienia</legend>

            <label class="filter-checkbox">
              <input
                v-model="onlyWithParking"
                type="checkbox"
              />

              <span class="filter-checkbox__mark"></span>

              <span class="filter-checkbox__label"> Miejsce parkingowe </span>
            </label>

            <label class="filter-checkbox">
              <input
                v-model="onlyWithStorage"
                type="checkbox"
              />

              <span class="filter-checkbox__mark"></span>

              <span class="filter-checkbox__label"> Komórka lokatorska </span>
            </label>
          </fieldset>
          <form
            class="filter-group"
            @submit.prevent="applyPriceFilter"
          >
            <legend class="filter-group__title">Cena mieszkania</legend>

            <div class="price-filter">
              <label>
                <span>Cena od</span>

                <div class="price-filter__input">
                  <input
                    v-model="priceFromInput"
                    type="number"
                    min="0"
                    step="50000"
                    placeholder="np. 500 000"
                  />

                  <span>zł</span>
                </div>
              </label>

              <label>
                <span>Cena do</span>

                <div class="price-filter__input">
                  <input
                    v-model="priceToInput"
                    type="number"
                    min="0"
                    step="50000"
                    placeholder="np. 900 000"
                  />

                  <span>zł</span>
                </div>
              </label>
            </div>
            <button
              class="price-filter__button"
              type="submit"
            >
              Zastosuj cenę
            </button>
          </form>
        </aside>

        <div class="apartments-content">
          <div class="apartments-toolbar">
            <p>
              Znaleziono
              <strong>{{ sortedApartments.length }}</strong>
              mieszkań
            </p>

            <div
              class="view-switcher"
              aria-label="Sposób wyświetlania mieszkań"
            >
              <button
                type="button"
                :class="{
                  'view-switcher__button--active': viewMode === 'grid'
                }"
                :aria-pressed="viewMode === 'grid'"
                @click="viewMode = 'grid'"
              >
                Grid
              </button>

              <button
                type="button"
                :class="{
                  'view-switcher__button--active': viewMode === 'list'
                }"
                :aria-pressed="viewMode === 'list'"
                @click="viewMode = 'list'"
              >
                Lista
              </button>

              <button
                type="button"
                :class="{
                  'view-switcher__button--active': viewMode === 'table'
                }"
                :aria-pressed="viewMode === 'table'"
                @click="viewMode = 'table'"
              >
                Tabela
              </button>

              <button
                type="button"
                :class="{
                  'view-switcher__button--active': viewMode === 'plan'
                }"
                :aria-pressed="viewMode === 'plan'"
                @click="viewMode = 'plan'"
              >
                Rzut
              </button>
            </div>

            <label class="apartments-sort">
              <span>Sortuj</span>

              <select v-model="selectedSort">
                <option value="default">Domyślna kolejność</option>

                <option value="price-asc">Cena: od najniższej</option>

                <option value="price-desc">Cena: od najwyższej</option>

                <option value="area-asc">Metraż: od najmniejszego</option>

                <option value="area-desc">Metraż: od największego</option>

                <option value="price-per-meter-asc">
                  Najniższa cena za m²
                </option>
              </select>
            </label>
          </div>

          <template v-if="sortedApartments.length > 0">
            <ApartmentGrid
              v-if="viewMode === 'grid'"
              :apartments="sortedApartments"
            />

            <ApartmentList
              v-else-if="viewMode === 'list'"
              :apartments="sortedApartments"
            />

            <ApartmentTable
              v-else-if="viewMode === 'table'"
              :apartments="sortedApartments"
            />

            <FloorPlanSelector
              v-else
              :floor-plan="floorPlans[0]"
            />
          </template>

          <div
            v-else
            class="apartments-empty"
          >
            <span class="apartments-empty__number">0</span>

            <h2>Brak pasujących mieszkań</h2>

            <p>
              Nie znaleźliśmy lokali spełniających wszystkie wybrane kryteria.
              Spróbuj zmienić filtry.
            </p>

            <button
              type="button"
              @click="resetFilters"
            >
              Wyczyść wszystkie filtry
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.apartments-page {
  padding-top: 88px;
}

.apartments-header {
  padding-block: clamp(70px, 9vw, 130px);
  color: #ffffff;
  background-color: var(--color-primary);
}

.apartments-header__eyebrow {
  margin-bottom: 20px;
  color: var(--color-accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.apartments-header h1 {
  max-width: 780px;
  margin-bottom: 40px;
  color: #ffffff;
  font-size: clamp(48pxreti, bal, 6vw, 76px);
}

.apartments-header__bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
}

.apartments-header__bottom p {
  max-width: 580px;
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: 17px;
}

.apartments-header__count {
  display: flex;
  align-items: center;
  gap: 13px;
}

.apartments-header__count strong {
  color: var(--color-accent);
  font-family: var(--font-heading);
  font-size: 46px;
  font-weight: 400;
  line-height: 1;
}

.apartments-header__count span {
  max-width: 75px;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.apartments-results {
  padding-block: clamp(60px, 8vw, 110px);
}

.apartments-layout {
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
  align-items: start;
  gap: 32px;
}

.filters-sidebar {
  position: sticky;
  top: 118px;
  min-height: 400px;
  padding: 28px;
  background-color: var(--color-surface);
  box-shadow: 0 14px 45px rgba(23, 63, 53, 0.08);
}

.filters-sidebar p {
  margin-bottom: 0;
  color: var(--color-primary);
  font-size: 18px;
  font-weight: 700;
}

.filters-sidebar__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 15px;
}

.filters-sidebar__header p {
  margin-bottom: 0;
}

.filters-sidebar__header span {
  flex-shrink: 0;
  padding: 5px 8px;
  color: var(--color-primary);
  background-color: var(--color-background);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
}

.filters-sidebar__header > div {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.filters-sidebar__reset {
  padding: 3px 0;
  color: var(--color-text-muted);
  background-color: transparent;
  border: 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 10px;
  font-weight: 700;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.filters-sidebar__reset:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.filter-group {
  margin: 22px 0 0;
  padding: 22px 0 0;
  border: 0;
  border-top: 1px solid var(--color-border);
}

.filter-group legend {
  padding: 0 5px 0 0;
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.filter-checkbox {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 12px;
  gap: 10px;
  color: var(--color-text-muted);
  font-size: 12px;
  cursor: pointer;
}

.filter-checkbox:last-child {
  margin-bottom: 0;
}

.filter-checkbox input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.filter-checkbox__mark {
  position: relative;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border: 1px solid #c7cbc8;
  border-radius: 3px;
}

.filter-checkbox input:checked + .filter-checkbox__mark {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.filter-checkbox input:checked + .filter-checkbox__mark::after {
  position: absolute;
  top: 2px;
  left: 5px;
  width: 5px;
  height: 9px;
  content: '';
  border-right: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  transform: rotate(45deg);
}

.status-dot {
  width: 7px;
  height: 7px;
  flex-shrink: 0;
  border-radius: 50%;
}

.status-dot--available {
  background-color: #3d806d;
}

.status-dot--reserved {
  background-color: #c28b3f;
}

.status-dot--sold {
  background-color: #929896;
}

.filter-checkbox__count {
  min-width: 20px;
  margin-left: auto;
  color: var(--color-text-muted);
  font-size: 9px;
  text-align: right;
}

.filter-group__title {
  margin-bottom: 15px;
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.price-filter {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.price-filter label > span {
  display: block;
  margin-bottom: 6px;
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 600;
}

.price-filter__input {
  display: flex;
  align-items: center;
  height: 42px;
  padding-inline: 10px;
  background-color: var(--color-background);
  border: 1px solid transparent;
  border-radius: var(--radius-small);
}

.price-filter__input:focus-within {
  border-color: var(--color-accent);
}

.price-filter__input input {
  width: 100%;
  min-width: 0;
  padding: 0;
  color: var(--color-primary);
  background: transparent;
  border: 0;
  outline: 0;
  font-size: 11px;
  font-weight: 600;
}

.price-filter__input > span {
  flex-shrink: 0;
  color: var(--color-text-muted);
  font-size: 9px;
}

.price-filter__button {
  width: 100%;
  min-height: 42px;
  margin-top: 12px;
  padding-inline: 16px;
  color: #ffffff;
  background-color: var(--color-primary);
  border: 0;
  border-radius: var(--radius-small);
  font-size: 11px;
  font-weight: 700;
  transition: background-color 0.2s ease;
}

.price-filter__button:hover {
  background-color: var(--color-primary-light);
}

.apartments-empty {
  display: flex;
  align-items: center;
  min-height: 480px;
  padding: 60px;
  flex-direction: column;
  justify-content: center;
  background-color: var(--color-surface);
  text-align: center;
}

.apartments-empty__number {
  display: grid;
  width: 100px;
  height: 100px;
  margin-bottom: 25px;
  place-items: center;
  color: var(--color-accent);
  background-color: var(--color-background);
  font-family: var(--font-heading);
  font-size: 54px;
  border-radius: 50%;
}

.apartments-empty h2 {
  margin-bottom: 12px;
  font-size: clamp(28px, 4vw, 40px);
}

.apartments-empty p {
  max-width: 490px;
  margin-bottom: 28px;
  color: var(--color-text-muted);
  font-size: 14px;
}

.apartments-empty button {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  padding-inline: 20px;
  gap: 14px;
  color: #ffffff;
  background-color: var(--color-primary);
  border: 0;
  border-radius: var(--radius-small);
  font-size: 11px;
  font-weight: 700;
}

.apartments-empty button:hover {
  background-color: var(--color-primary-light);
}

.apartments-empty button span {
  font-size: 17px;
  transition: transform 0.2s ease;
}

.apartments-empty button:hover span {
  transform: translateX(4px);
}

.apartments-content {
  min-width: 0;
}

.apartments-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 62px;
  margin-bottom: 24px;
  padding: 10px 12px 10px 20px;
  gap: 24px;
  background-color: var(--color-surface);
}

.apartments-toolbar p {
  margin-bottom: 0;
  color: var(--color-text-muted);
  font-size: 12px;
}

.apartments-toolbar p strong {
  color: var(--color-primary);
  font-size: 14px;
}

.apartments-sort {
  display: flex;
  align-items: center;
  gap: 12px;
}

.apartments-sort > span {
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.apartments-sort select {
  height: 42px;
  padding-inline: 14px 32px;
  color: var(--color-primary);
  background-color: var(--color-background);
  border: 1px solid transparent;
  border-radius: var(--radius-small);
  outline: none;
  font-size: 11px;
  font-weight: 600;
}

.apartments-sort select:focus {
  border-color: var(--color-accent);
}

.view-switcher {
  display: flex;
  padding: 4px;
  gap: 4px;
  background-color: var(--color-background);
  border-radius: var(--radius-small);
}

.view-switcher button {
  min-height: 34px;
  padding-inline: 13px;
  color: var(--color-text-muted);
  background-color: transparent;
  border: 0;
  border-radius: calc(var(--radius-small) - 2px);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.view-switcher button:hover {
  color: var(--color-primary);
  background-color: #fff;
}

.view-switcher .view-switcher__button--active {
  color: #ffffff;
  background-color: var(--color-primary);
}

@media (max-width: 991px) {
  .apartments-layout {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: static;
    min-height: 150px;
  }
}

@media (max-width: 767px) {
  .apartments-header__bottom {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 479px) {
  .apartments-layout {
    gap: 24px;
  }

  .filters-sidebar {
    padding: 22px 18px;
  }

  .apartments-empty {
    min-height: 400px;
    padding: 40px 20px;
  }

  .apartments-toolbar {
    align-items: stretch;
    padding: 16px;
    flex-direction: column;
    gap: 12px;
  }

  .apartments-sort {
    align-items: stretch;
    flex-direction: column;
    gap: 6px;
  }

  .apartments-sort select {
    width: 100%;
  }
}
</style>
