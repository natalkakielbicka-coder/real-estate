<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ApartmentGrid from '../components/ApartmentGrid.vue'
import ApartmentList from '../components/ApartmentList.vue'
import ApartmentTable from '../components/ApartmentTable.vue'
import FloorPlanSelector from '../components/FloorPlanSelector.vue'
import InvestmentsMap from '../components/InvestmentsMap.vue'
import { floorPlans } from '../data/floorPlans'
import { apartments } from '../data/apartments'
import { apartmentStatusClasses } from '../constants/apartmentStatuses'
import { useToast } from '../composables/useToast'
import { getApartmentsLabel } from '../utils/apartmentFormatters'

const { showToast } = useToast()

const selectedStatuses = ref([])
const selectedOutdoorSpaces = ref([])
const onlyWithParking = ref(false)
const onlyWithStorage = ref(false)
const selectedSort = ref('default')

const route = useRoute()
const router = useRouter()

const getQueryValues = (value) => {
  if (!value) {
    return []
  }

  const queryValue = Array.isArray(value) ? value[0] : value

  return queryValue.split(',')
}

const getQueryNumber = (value) => {
  if (value === undefined || value === '') {
    return null
  }

  const queryValue = Array.isArray(value) ? value[0] : value
  const numberValue = Number(queryValue)

  return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : null
}

const availableSortValues = [
  'default',
  'price-asc',
  'price-desc',
  'area-asc',
  'area-desc',
  'price-per-meter-asc'
]

const sortQueryValue = Array.isArray(route.query.sort)
  ? route.query.sort[0]
  : route.query.sort

if (availableSortValues.includes(sortQueryValue)) {
  selectedSort.value = sortQueryValue
}

const selectedCities = ref(getQueryValues(route.query.city))

const selectedRooms = ref(
  getQueryValues(route.query.rooms).map(Number).filter(Number.isFinite)
)

const availableStatusValues = ['available', 'reserved', 'sold']

const availableOutdoorSpaceValues = ['balcony', 'terrace', 'garden', 'loggia']

selectedStatuses.value = getQueryValues(route.query.status).filter((status) => {
  return availableStatusValues.includes(status)
})

selectedOutdoorSpaces.value = getQueryValues(route.query.outdoorSpace).filter(
  (outdoorSpace) => {
    return availableOutdoorSpaceValues.includes(outdoorSpace)
  }
)

onlyWithParking.value = route.query.parking === '1'
onlyWithStorage.value = route.query.storage === '1'

const availableViewModes = ['grid', 'list', 'table', 'plan', 'map']

const isFiltersOpen = ref(false)

const viewMode = ref(
  availableViewModes.includes(route.query.view) ? route.query.view : 'grid'
)

const selectedFloorNumber = ref(floorPlans[0].floor)

const selectedFloorPlan = computed(() => {
  return floorPlans.find((floorPlan) => {
    return floorPlan.floor === selectedFloorNumber.value
  })
})

const selectFloorPlan = (floorPlan) => {
  selectedFloorNumber.value = floorPlan.floor
}

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

const minPriceFromQuery = getQueryNumber(route.query.minPrice)
const maxPriceFromQuery = getQueryNumber(route.query.maxPrice)

const priceFromInput = ref(minPriceFromQuery ?? '')
const priceToInput = ref(maxPriceFromQuery ?? '')

const minPrice = ref(minPriceFromQuery)
const maxPrice = ref(maxPriceFromQuery)

const formatPrice = (price) => {
  return new Intl.NumberFormat('pl-PL').format(price)
}

const removeArrayFilter = (selectedFilters, valueToRemove) => {
  selectedFilters.value = selectedFilters.value.filter(
    (value) => value !== valueToRemove
  )
}

const activeFilters = computed(() => {
  const filters = []

  selectedCities.value.forEach((city) => {
    filters.push({
      id: `city-${city}`,
      label: city,
      remove: () => removeArrayFilter(selectedCities, city)
    })
  })

  selectedRooms.value.forEach((room) => {
    filters.push({
      id: `rooms-${room}`,
      label: room === 1 ? '1 pokój' : `${room} pokoje`,
      remove: () => removeArrayFilter(selectedRooms, room)
    })
  })

  selectedStatuses.value.forEach((statusValue) => {
    const status = statuses.find((item) => item.value === statusValue)

    filters.push({
      id: `status-${statusValue}`,
      label: status.label,
      remove: () => removeArrayFilter(selectedStatuses, statusValue)
    })
  })

  selectedOutdoorSpaces.value.forEach((spaceValue) => {
    const space = outdoorSpaces.find((item) => item.value === spaceValue)

    filters.push({
      id: `outdoor-space-${spaceValue}`,
      label: space.label,
      remove: () => removeArrayFilter(selectedOutdoorSpaces, spaceValue)
    })
  })

  if (onlyWithParking.value) {
    filters.push({
      id: 'parking',
      label: 'Miejsce parkingowe',
      remove: () => {
        onlyWithParking.value = false
      }
    })
  }

  if (onlyWithStorage.value) {
    filters.push({
      id: 'storage',
      label: 'Komórka lokatorska',
      remove: () => {
        onlyWithStorage.value = false
      }
    })
  }

  if (minPrice.value !== null) {
    filters.push({
      id: 'min-price',
      label: `od ${formatPrice(minPrice.value)} zł`,
      remove: () => {
        minPrice.value = null
        priceFromInput.value = ''
      }
    })
  }

  if (maxPrice.value !== null) {
    filters.push({
      id: 'max-price',
      label: `do ${formatPrice(maxPrice.value)} zł`,
      remove: () => {
        maxPrice.value = null
        priceToInput.value = ''
      }
    })
  }

  return filters
})

const filtersQuery = computed(() => {
  return {
    city:
      selectedCities.value.length > 0
        ? selectedCities.value.join(',')
        : undefined,

    rooms:
      selectedRooms.value.length > 0
        ? selectedRooms.value.join(',')
        : undefined,

    status:
      selectedStatuses.value.length > 0
        ? selectedStatuses.value.join(',')
        : undefined,

    outdoorSpace:
      selectedOutdoorSpaces.value.length > 0
        ? selectedOutdoorSpaces.value.join(',')
        : undefined,

    parking: onlyWithParking.value ? '1' : undefined,

    storage: onlyWithStorage.value ? '1' : undefined,

    minPrice: minPrice.value ?? undefined,

    maxPrice: maxPrice.value ?? undefined,

    sort: selectedSort.value !== 'default' ? selectedSort.value : undefined,

    view: viewMode.value !== 'grid' ? viewMode.value : undefined
  }
})

watch(filtersQuery, (newQuery) => {
  router.replace({
    query: newQuery
  })
})

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

  router.replace({
    query: {
      view: route.query.view
    }
  })

  showToast('Filtry zostały wyczyszczone', 'success')
}

const showInvestmentApartments = (city) => {
  resetFilters()

  selectedCities.value = [city]
  viewMode.value = 'grid'
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

const apartmentMatchesFilters = (apartment, ignoredFilter = null) => {
  const matchesCity =
    ignoredFilter === 'city' ||
    selectedCities.value.length === 0 ||
    selectedCities.value.includes(apartment.city)

  const matchesRooms =
    ignoredFilter === 'rooms' ||
    selectedRooms.value.length === 0 ||
    selectedRooms.value.includes(apartment.rooms)

  const matchesStatus =
    ignoredFilter === 'status' ||
    selectedStatuses.value.length === 0 ||
    selectedStatuses.value.includes(apartment.status)

  const matchesMinPrice =
    ignoredFilter === 'price' ||
    minPrice.value === null ||
    apartment.price >= minPrice.value

  const matchesMaxPrice =
    ignoredFilter === 'price' ||
    maxPrice.value === null ||
    apartment.price <= maxPrice.value

  const matchesOutdoorSpace =
    ignoredFilter === 'outdoorSpace' ||
    selectedOutdoorSpaces.value.length === 0 ||
    selectedOutdoorSpaces.value.includes(apartment.outdoorSpace.type)

  const matchesParking =
    ignoredFilter === 'parking' ||
    !onlyWithParking.value ||
    apartment.parkingSpace

  const matchesStorage =
    ignoredFilter === 'storage' ||
    !onlyWithStorage.value ||
    apartment.storageRoom

  const matchesFloor =
    ignoredFilter === 'floor' ||
    viewMode.value !== 'plan' ||
    (apartment.investmentId === selectedFloorPlan.value.investmentId &&
      apartment.building === selectedFloorPlan.value.building &&
      Number(apartment.floor) === Number(selectedFloorNumber.value))

  return (
    matchesCity &&
    matchesRooms &&
    matchesStatus &&
    matchesMinPrice &&
    matchesMaxPrice &&
    matchesOutdoorSpace &&
    matchesParking &&
    matchesStorage &&
    matchesFloor
  )
}

const filteredApartments = computed(() => {
  return apartments.filter((apartment) => {
    return apartmentMatchesFilters(apartment)
  })
})

const roomCounts = computed(() => {
  return Object.fromEntries(
    rooms.map((room) => {
      const count = apartments.filter((apartment) => {
        return (
          apartmentMatchesFilters(apartment, 'rooms') &&
          apartment.rooms === room
        )
      }).length

      return [room, count]
    })
  )
})

const cityCounts = computed(() => {
  return Object.fromEntries(
    cities.map((city) => {
      const count = apartments.filter((apartment) => {
        return (
          apartmentMatchesFilters(apartment, 'city') && apartment.city === city
        )
      }).length

      return [city, count]
    })
  )
})

const statusCounts = computed(() => {
  return Object.fromEntries(
    statuses.map((status) => {
      const count = apartments.filter((apartment) => {
        return (
          apartmentMatchesFilters(apartment, 'status') &&
          apartment.status === status.value
        )
      }).length

      return [status.value, count]
    })
  )
})

const outdoorSpaceCounts = computed(() => {
  return Object.fromEntries(
    outdoorSpaces.map((space) => {
      const count = apartments.filter((apartment) => {
        return (
          apartmentMatchesFilters(apartment, 'outdoorSpace') &&
          apartment.outdoorSpace.type === space.value
        )
      }).length

      return [space.value, count]
    })
  )
})

const amenityCounts = computed(() => {
  const parking = apartments.filter((apartment) => {
    return (
      apartmentMatchesFilters(apartment, 'parking') && apartment.parkingSpace
    )
  }).length

  const storage = apartments.filter((apartment) => {
    return (
      apartmentMatchesFilters(apartment, 'storage') && apartment.storageRoom
    )
  }).length

  return {
    parking,
    storage
  }
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

  return apartmentsToSort.sort((a, b) => {
    const investmentComparison = a.investment.localeCompare(
      b.investment,
      'pl',
      {
        sensitivity: 'base'
      }
    )

    if (investmentComparison !== 0) {
      return investmentComparison
    }

    return a.number.localeCompare(b.number, 'pl', {
      numeric: true,
      sensitivity: 'base'
    })
  })
})

const getOffersLabel = (count) => {
  if (count === 1) {
    return 'oferta'
  }

  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    (lastTwoDigits < 12 || lastTwoDigits > 14)
  ) {
    return 'oferty'
  }

  return 'ofert'
}
</script>

<template>
  <main class="pt-[88px]">
    <section class="bg-brand py-[clamp(70px,9vw,130px)] text-white">
      <div class="container">
        <p
          class="mb-5 text-[11px] font-bold tracking-[0.16em] text-gold uppercase"
        >
          Oferta mieszkań
        </p>

        <h1
          class="mb-[30px] max-w-[780px] text-[clamp(48px,6vw,76px)] text-white"
        >
          Znajdź swoje mieszkanie
        </h1>

        <div
          class="flex items-end justify-between gap-10 max-sm:flex-col max-sm:items-start"
        >
          <p class="mb-0 max-w-[580px] text-[17px] text-white/68">
            Porównaj dostępne lokale i wybierz przestrzeń dopasowaną do Twoich
            potrzeb.
          </p>

          <div class="flex items-center gap-[13px]">
            <strong
              class="font-display text-[46px] leading-none font-normal text-gold"
            >
              {{ apartments.length }}
            </strong>
            <span
              class="max-w-[75px] text-[10px] leading-[1.4] font-bold tracking-[0.08em] uppercase"
            >
              dostępnych ofert
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="py-[clamp(60px,8vw,110px)]">
      <div
        class="container grid grid-cols-1 items-start gap-6 xs:gap-8 md:grid-cols-[270px_minmax(0,1fr)]"
      >
        <button
          class="flex min-h-12 w-full items-center justify-between gap-4 bg-brand px-5 text-[11px] font-bold text-white md:hidden"
          type="button"
          aria-controls="apartments-filters"
          :aria-expanded="isFiltersOpen"
          @click="isFiltersOpen = !isFiltersOpen"
        >
          <span>
            {{ isFiltersOpen ? 'Ukryj filtry' : 'Pokaż filtry' }}
          </span>

          <span
            v-if="activeFilters.length > 0"
            class="grid h-6 min-w-6 place-items-center rounded-full bg-white px-1.5 text-[9px] text-brand"
          >
            {{ activeFilters.length }}
          </span>
        </button>

        <aside
          id="apartments-filters"
          class="min-h-[150px] bg-panel px-[18px] py-[22px] shadow-[0_14px_45px_rgba(23,63,53,0.08)] xs:p-7 md:sticky md:top-[118px] md:block md:min-h-[400px]"
          :class="isFiltersOpen ? 'block' : 'hidden'"
        >
          <div class="mb-7 flex items-start justify-between gap-[15px]">
            <p class="mb-0 text-lg font-bold text-brand">Filtry mieszkań</p>
            <span
              class="shrink-0 bg-page px-2 py-[5px] text-[9px] font-bold text-brand uppercase"
            >
              {{ filteredApartments.length }}
              {{ getOffersLabel(filteredApartments.length) }}
            </span>
          </div>

          <button
            v-if="activeFilters.length > 0"
            class="border-0 border-b border-line bg-transparent py-[3px] text-[10px] font-bold text-muted transition-colors hover:border-brand hover:text-brand"
            type="button"
            @click="resetFilters"
          >
            Wyczyść wszystkie
          </button>

          <fieldset class="mt-[22px] border-0 border-t border-line pt-[22px]">
            <legend
              class="pr-[5px] text-[11px] font-bold tracking-[0.08em] text-brand uppercase"
            >
              Miasto
            </legend>
            <label
              v-for="city in cities"
              :key="city"
              class="filter-checkbox has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40"
            >
              <input
                v-model="selectedCities"
                type="checkbox"
                :value="city"
                :disabled="
                  cityCounts[city] === 0 && !selectedCities.includes(city)
                "
              />
              <span class="filter-checkbox__mark"></span>
              <span>{{ city }}</span>

              <small class="ml-auto min-w-5 text-right text-[9px] text-muted">
                {{ cityCounts[city] }}
              </small>
            </label>
          </fieldset>

          <fieldset class="mt-[22px] border-0 border-t border-line pt-[22px]">
            <legend
              class="pr-[5px] text-[11px] font-bold tracking-[0.08em] text-brand uppercase"
            >
              Liczba pokoi
            </legend>
            <label
              v-for="room in rooms"
              :key="room"
              class="filter-checkbox has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40"
            >
              <input
                v-model="selectedRooms"
                type="checkbox"
                :value="room"
                :disabled="
                  roomCounts[room] === 0 && !selectedRooms.includes(room)
                "
              />
              <span class="filter-checkbox__mark"></span>
              <span>{{ room }} {{ room === 1 ? 'pokój' : 'pokoje' }}</span>

              <small class="ml-auto min-w-5 text-right text-[9px] text-muted">
                {{ roomCounts[room] }}
              </small>
            </label>
          </fieldset>

          <fieldset class="mt-[22px] border-0 border-t border-line pt-[22px]">
            <legend
              class="pr-[5px] text-[11px] font-bold tracking-[0.08em] text-brand uppercase"
            >
              Status mieszkania
            </legend>
            <label
              v-for="status in statuses"
              :key="status.value"
              class="filter-checkbox has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40"
            >
              <input
                v-model="selectedStatuses"
                type="checkbox"
                :value="status.value"
                :disabled="
                  statusCounts[status.value] === 0 &&
                  !selectedStatuses.includes(status.value)
                "
              />
              <span class="filter-checkbox__mark"></span>
              <span
                class="h-[7px] w-[7px] shrink-0 rounded-full"
                :class="apartmentStatusClasses[status.value]"
              ></span>
              <span>{{ status.label }}</span>
              <small class="ml-auto min-w-5 text-right text-[9px] text-muted">
                {{ statusCounts[status.value] }}
              </small>
            </label>
          </fieldset>

          <fieldset class="mt-[22px] border-0 border-t border-line pt-[22px]">
            <legend
              class="pr-[5px] text-[11px] font-bold tracking-[0.08em] text-brand uppercase"
            >
              Przestrzeń dodatkowa
            </legend>
            <label
              v-for="space in outdoorSpaces"
              :key="space.value"
              class="filter-checkbox has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40"
            >
              <input
                v-model="selectedOutdoorSpaces"
                type="checkbox"
                :value="space.value"
                :disabled="
                  outdoorSpaceCounts[space.value] === 0 &&
                  !selectedOutdoorSpaces.includes(space.value)
                "
              />
              <span class="filter-checkbox__mark"></span>
              <span>{{ space.label }}</span>
              <small class="ml-auto min-w-5 text-right text-[9px] text-muted">
                {{ outdoorSpaceCounts[space.value] }}
              </small>
            </label>
          </fieldset>

          <fieldset class="mt-[22px] border-0 border-t border-line pt-[22px]">
            <legend
              class="pr-[5px] text-[11px] font-bold tracking-[0.08em] text-brand uppercase"
            >
              Dodatkowe udogodnienia
            </legend>
            <label
              class="filter-checkbox has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40"
            >
              <input
                v-model="onlyWithParking"
                type="checkbox"
                :disabled="amenityCounts.parking === 0 && !onlyWithParking"
              />
              <span class="filter-checkbox__mark"></span>
              <span>Miejsce parkingowe</span>

              <small class="ml-auto min-w-5 text-right text-[9px] text-muted">
                {{ amenityCounts.parking }}
              </small>
            </label>
            <label
              class="filter-checkbox has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40"
            >
              <input
                v-model="onlyWithStorage"
                type="checkbox"
                :disabled="amenityCounts.storage === 0 && !onlyWithStorage"
              />
              <span class="filter-checkbox__mark"></span>
              <span>Komórka lokatorska</span>

              <small class="ml-auto min-w-5 text-right text-[9px] text-muted">
                {{ amenityCounts.storage }}
              </small>
            </label>
          </fieldset>

          <form
            class="mt-[22px] border-0 border-t border-line pt-[22px]"
            @submit.prevent="applyPriceFilter"
          >
            <h3
              class="mb-[15px] font-copy text-[11px] font-bold tracking-[0.06em] text-brand uppercase"
            >
              Cena mieszkania
            </h3>
            <div class="grid grid-cols-2 gap-2.5">
              <label>
                <span class="mb-1.5 block text-[9px] font-semibold text-muted"
                  >Cena od</span
                >
                <div
                  class="flex h-[42px] items-center rounded-[3px] border border-transparent bg-page px-2.5 focus-within:border-gold"
                >
                  <input
                    v-model="priceFromInput"
                    class="w-full min-w-0 border-0 bg-transparent p-0 text-[11px] font-semibold text-brand outline-0"
                    type="number"
                    min="0"
                    step="50000"
                    placeholder="np. 500 000"
                  />
                  <span class="shrink-0 text-[9px] text-muted">zł</span>
                </div>
              </label>
              <label>
                <span class="mb-1.5 block text-[9px] font-semibold text-muted"
                  >Cena do</span
                >
                <div
                  class="flex h-[42px] items-center rounded-[3px] border border-transparent bg-page px-2.5 focus-within:border-gold"
                >
                  <input
                    v-model="priceToInput"
                    class="w-full min-w-0 border-0 bg-transparent p-0 text-[11px] font-semibold text-brand outline-0"
                    type="number"
                    min="0"
                    step="50000"
                    placeholder="np. 900 000"
                  />
                  <span class="shrink-0 text-[9px] text-muted">zł</span>
                </div>
              </label>
            </div>
            <button
              class="mt-3 min-h-[42px] w-full rounded-[3px] border-0 bg-brand px-4 text-[11px] font-bold text-white transition-colors hover:bg-brand-light"
              type="submit"
            >
              Zastosuj cenę
            </button>
          </form>
        </aside>

        <div class="min-w-0">
          <div
            v-if="activeFilters.length > 0"
            class="mb-4 flex flex-wrap items-center gap-2"
            aria-label="Aktywne filtry"
          >
            <button
              v-for="filter in activeFilters"
              :key="filter.id"
              class="group inline-flex min-h-9 items-center gap-2 rounded-full border border-line bg-panel px-3.5 text-[11px] font-semibold text-brand transition-colors hover:border-brand"
              type="button"
              :aria-label="`Usuń filtr: ${filter.label}`"
              @click="filter.remove"
            >
              {{ filter.label }}

              <span
                class="text-base leading-none text-muted transition-colors group-hover:text-brand"
                aria-hidden="true"
              >
                ×
              </span>
            </button>
          </div>
          <div
            class="mb-6 flex flex-col items-stretch gap-3 bg-panel p-4 xs:min-h-[62px] xs:flex-row xs:items-center xs:justify-between xs:gap-6 xs:py-2.5 xs:pr-3 xs:pl-5"
          >
            <p class="mb-0 text-xs text-muted">
              Znaleziono
              <strong class="text-sm text-brand">
                {{ sortedApartments.length }}
              </strong>
              {{ getApartmentsLabel(sortedApartments.length) }}
            </p>

            <div
              class="flex gap-1 rounded-[3px] bg-page p-1"
              aria-label="Sposób wyświetlania mieszkań"
            >
              <button
                class="min-h-[34px] rounded-[1px] border-0 px-[13px] text-[10px] font-bold uppercase"
                :class="
                  viewMode === 'grid'
                    ? 'bg-brand text-white'
                    : 'bg-transparent text-muted hover:bg-white hover:text-brand'
                "
                type="button"
                :aria-pressed="viewMode === 'grid'"
                @click="viewMode = 'grid'"
              >
                Grid
              </button>

              <button
                class="min-h-[34px] rounded-[1px] border-0 px-[13px] text-[10px] font-bold uppercase"
                :class="
                  viewMode === 'list'
                    ? 'bg-brand text-white'
                    : 'bg-transparent text-muted hover:bg-white hover:text-brand'
                "
                type="button"
                :aria-pressed="viewMode === 'list'"
                @click="viewMode = 'list'"
              >
                Lista
              </button>

              <button
                class="min-h-[34px] rounded-[1px] border-0 px-[13px] text-[10px] font-bold uppercase"
                :class="
                  viewMode === 'table'
                    ? 'bg-brand text-white'
                    : 'bg-transparent text-muted hover:bg-white hover:text-brand'
                "
                type="button"
                :aria-pressed="viewMode === 'table'"
                @click="viewMode = 'table'"
              >
                Tabela
              </button>

              <button
                class="min-h-[34px] rounded-[1px] border-0 px-[13px] text-[10px] font-bold uppercase"
                :class="
                  viewMode === 'plan'
                    ? 'bg-brand text-white'
                    : 'bg-transparent text-muted hover:bg-white hover:text-brand'
                "
                type="button"
                :aria-pressed="viewMode === 'plan'"
                @click="viewMode = 'plan'"
              >
                Rzut
              </button>

              <button
                class="min-h-[34px] rounded-[1px] border-0 px-[13px] text-[10px] font-bold uppercase"
                :class="
                  viewMode === 'map'
                    ? 'bg-brand text-white'
                    : 'bg-transparent text-muted hover:bg-white hover:text-brand'
                "
                type="button"
                :aria-pressed="viewMode === 'map'"
                @click="viewMode = 'map'"
              >
                Mapa
              </button>
            </div>

            <label
              class="flex flex-col items-stretch gap-1.5 xs:flex-row xs:items-center xs:gap-3"
            >
              <span class="text-[10px] font-bold text-muted uppercase"
                >Sortuj</span
              >
              <select
                v-model="selectedSort"
                class="h-[42px] w-full rounded-[3px] border border-transparent bg-page pr-8 pl-3.5 text-[11px] font-semibold text-brand outline-none focus:border-gold xs:w-auto"
              >
                <option value="default">Inwestycja i numer</option>
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

          <template v-if="sortedApartments.length > 0 || viewMode === 'plan'">
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
            <div v-else-if="viewMode === 'plan'">
              <div
                class="mb-4 flex flex-wrap items-center gap-2 bg-panel p-3 shadow-[0_8px_24px_rgba(23,63,53,0.06)]"
                aria-label="Wybierz piętro"
              >
                <span
                  class="mr-2 text-[10px] font-bold tracking-[0.08em] text-muted uppercase"
                >
                  Piętro
                </span>

                <button
                  v-for="floorPlan in floorPlans"
                  :key="floorPlan.id"
                  class="min-h-[38px] rounded-[3px] border px-3.5 text-[10px] font-bold transition-colors"
                  :class="
                    selectedFloorNumber === floorPlan.floor
                      ? 'border-brand bg-brand text-white'
                      : 'border-line bg-page text-brand hover:border-gold hover:text-gold'
                  "
                  type="button"
                  :aria-pressed="selectedFloorNumber === floorPlan.floor"
                  @click="selectFloorPlan(floorPlan)"
                >
                  {{ floorPlan.floor === 0 ? 'Parter' : `${floorPlan.floor}.` }}
                </button>
              </div>

              <FloorPlanSelector
                :floor-plan="selectedFloorPlan"
                :visible-apartments="sortedApartments"
                @reset-filters="resetFilters"
              />
            </div>
            <InvestmentsMap
              v-else
              :apartments="sortedApartments"
              @show-investment="showInvestmentApartments"
            />
          </template>

          <div
            v-else
            class="flex min-h-[480px] flex-col items-center justify-center bg-panel p-[60px] text-center max-xs:min-h-[400px] max-xs:px-5 max-xs:py-10"
          >
            <span
              class="mb-[25px] grid h-[100px] w-[100px] place-items-center rounded-full bg-page font-display text-[54px] text-gold"
              >0</span
            >
            <h2 class="mb-3 text-[clamp(28px,4vw,40px)]">
              {{
                activeFilters.length > 0
                  ? 'Brak mieszkań spełniających kryteria'
                  : 'Obecnie brak dostępnych mieszkań'
              }}
            </h2>

            <p class="mb-7 max-w-[490px] text-sm text-muted">
              {{
                activeFilters.length > 0
                  ? 'Spróbuj usunąć jeden z filtrów lub wyczyść wszystkie kryteria.'
                  : 'Wkrótce mogą pojawić się tutaj nowe oferty.'
              }}
            </p>
            <button
              v-if="activeFilters.length > 0"
              class="group inline-flex min-h-12 items-center gap-3.5 rounded-[3px] border-0 bg-brand px-5 text-[11px] font-bold text-white hover:bg-brand-light"
              type="button"
              @click="resetFilters"
            >
              Wyczyść wszystkie filtry
              <span
                class="text-[17px] transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
                >→</span
              >
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
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
</style>
