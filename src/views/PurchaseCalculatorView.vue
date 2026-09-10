<script setup>
import { ref, computed } from 'vue'
import { apartments } from '../data/apartments'
import SelectedApartmentCard from '../components/SelectedApartmentCard.vue'

const formatPrice = (price) => {
  const formattedPrice = new Intl.NumberFormat('pl-PL').format(price)

  return formattedPrice
}

const availableApartments = apartments.filter((apartment) => {
  return apartment.status === 'available'
})

const availableInvestments = [
  ...new Set(
    availableApartments.map((apartment) => {
      return apartment.investment
    })
  )
]

const firstAvailableApartment = availableApartments[0]
const selectedInvestment = ref(availableInvestments[0])

const apartmentsFromSelectedInvestment = computed(() => {
  return availableApartments.filter((apartment) => {
    return apartment.investment === selectedInvestment.value
  })
})

const handleInvestmentChange = () => {
  const firstApartment = apartmentsFromSelectedInvestment.value[0]

  selectedApartmentId.value = firstApartment.id
}

const selectedApartmentId = ref(firstAvailableApartment.id)
const ownContribution = ref(100000)
const finishingCostPerMeter = ref(2500)
const notaryFee = ref(4000)

const includeParkingSpace = ref(false)
const parkingSpacePrice = ref(35000)

const includeStorageRoom = ref(false)
const storageRoomPrice = ref(15000)

const parkingCost = computed(() => {
  if (includeParkingSpace.value) {
    return parkingSpacePrice.value || 0
  }

  return 0
})

const storageRoomCost = computed(() => {
  if (includeStorageRoom.value) {
    return storageRoomPrice.value || 0
  }

  return 0
})

const totalAdditionalCosts = computed(() => {
  const notaryCost = notaryFee.value || 0

  return notaryCost + parkingCost.value + storageRoomCost.value
})

const finishingStandards = [
  {
    name: 'Podstawowy',
    price: 1800
  },
  {
    name: 'Komfort',
    price: 2500
  },
  {
    name: 'Premium',
    price: 3500
  }
]

const selectFinishingStandard = (price) => {
  finishingCostPerMeter.value = price
}

const selectedApartment = computed(() => {
  const foundApartment = apartmentsFromSelectedInvestment.value.find(
    (apartment) => {
      return apartment.id === selectedApartmentId.value
    }
  )

  return foundApartment || apartmentsFromSelectedInvestment.value[0] || null
})

const neededLoan = computed(() => {
  if (!selectedApartment.value) {
    return 0
  }

  const apartmentPrice = selectedApartment.value.price
  const contribution = ownContribution.value || 0
  const loanAmount = apartmentPrice - contribution

  return Math.max(loanAmount, 0)
})

const totalFinishingCost = computed(() => {
  if (!selectedApartment.value) {
    return 0
  }

  const apartmentArea = selectedApartment.value.area
  const costPerMeter = finishingCostPerMeter.value || 0

  return apartmentArea * costPerMeter
})

const contributionPercent = computed(() => {
  if (!selectedApartment.value) {
    return 0
  }

  const apartmentPrice = selectedApartment.value.price
  const contribution = ownContribution.value || 0
  const percent = (contribution / apartmentPrice) * 100

  return Math.min(Math.round(percent), 100)
})

const hasLowContribution = computed(() => {
  return contributionPercent.value < 20
})
</script>

<template>
  <main class="min-h-screen bg-page pt-[74px] sm:pt-[88px]">
    <section class="bg-brand py-[clamp(48px,7vw,88px)]">
      <div class="container">
        <p class="mb-4 text-xs font-bold tracking-[0.18em] text-gold uppercase">
          Zaplanuj swój budżet
        </p>

        <h1 class="max-w-[760px] text-[clamp(40px,6vw,76px)] text-panel">
          Kalkulator kosztów zakupu
        </h1>

        <p class="mt-5 max-w-[620px] text-base text-white/70">
          Sprawdź pełny koszt zakupu mieszkania, wysokość dodatkowych opłat oraz
          potrzebnego finansowania.
        </p>
      </div>
    </section>

    <section class="py-[clamp(48px,7vw,88px)]">
      <div
        class="container grid items-start gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]"
      >
        <div>
          <section
            class="rounded-[14px] border border-line bg-panel p-[clamp(22px,3vw,32px)] shadow-[0_10px_35px_rgba(23,63,53,0.06)]"
          >
            <!-- Nagłówek kroku -->
            <div class="flex items-start gap-4">
              <span
                class="grid size-11 shrink-0 place-items-center rounded-full bg-page font-display text-xl text-brand"
                aria-hidden="true"
              >
                1
              </span>

              <div>
                <h2 class="mb-1 text-[clamp(25px,3vw,32px)]">
                  Wybierz mieszkanie
                </h2>

                <p class="mb-0 text-sm text-muted">
                  Wybierz inwestycję, a następnie jedno z dostępnych mieszkań.
                </p>
              </div>
            </div>

            <!-- Selecty -->
            <div class="mt-7 grid gap-5 sm:grid-cols-2">
              <!-- Inwestycja -->
              <div>
                <label
                  for="investment"
                  class="mb-2 block text-sm font-semibold text-[var(--color-text)]"
                >
                  Inwestycja
                </label>

                <div class="relative">
                  <select
                    id="investment"
                    v-model="selectedInvestment"
                    class="min-h-[54px] w-full appearance-none rounded-[6px] border border-line bg-panel py-3 pr-12 pl-4 text-sm font-semibold text-[var(--color-text)] transition-colors outline-none hover:border-gold focus:border-brand"
                    @change="handleInvestmentChange"
                  >
                    <option
                      v-for="investment in availableInvestments"
                      :key="investment"
                      :value="investment"
                    >
                      {{ investment }}
                    </option>
                  </select>

                  <svg
                    class="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-brand"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>

              <!-- Mieszkanie -->
              <div>
                <label
                  for="apartment"
                  class="mb-2 block text-sm font-semibold text-[var(--color-text)]"
                >
                  Mieszkanie
                </label>

                <div class="relative">
                  <select
                    id="apartment"
                    v-model="selectedApartmentId"
                    class="min-h-[54px] w-full appearance-none rounded-[6px] border border-line bg-panel py-3 pr-12 pl-4 text-sm font-semibold text-[var(--color-text)] transition-colors outline-none hover:border-gold focus:border-brand"
                  >
                    <option
                      v-for="apartment in apartmentsFromSelectedInvestment"
                      :key="apartment.id"
                      :value="apartment.id"
                    >
                      {{ apartment.number }} · {{ apartment.rooms }} pokoje ·
                      {{ apartment.area }} m²
                    </option>
                  </select>

                  <svg
                    class="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-brand"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Wybrane mieszkanie -->
            <SelectedApartmentCard
              v-if="selectedApartment"
              class="mt-5"
              :apartment="selectedApartment"
            />
          </section>

          <section
            class="mt-4 rounded-[14px] border border-line bg-panel p-[clamp(22px,3vw,32px)] shadow-[0_10px_35px_rgba(23,63,53,0.06)]"
          >
            <!-- Nagłówek -->
            <div class="flex items-start gap-4">
              <span
                class="grid size-11 shrink-0 place-items-center rounded-full bg-page font-display text-xl text-brand"
                aria-hidden="true"
              >
                2
              </span>

              <div>
                <h2 class="mb-1 text-[clamp(25px,3vw,32px)]">Finansowanie</h2>

                <p class="mb-0 text-sm text-muted">
                  Określ wysokość wkładu własnego, aby zobaczyć szacowaną kwotę
                  kredytu.
                </p>
              </div>
            </div>

            <!-- Pole wkładu własnego -->
            <div class="mt-8">
              <label
                for="own-contribution"
                class="mb-2 block text-sm font-semibold text-[var(--color-text)]"
              >
                Wkład własny
              </label>

              <div class="relative">
                <input
                  id="own-contribution"
                  v-model.number="ownContribution"
                  class="min-h-[54px] w-full rounded-[6px] border border-line bg-panel py-3 pr-16 pl-4 font-semibold text-[var(--color-text)] transition-colors outline-none hover:border-gold focus:border-brand"
                  type="number"
                  min="0"
                  step="1000"
                />

                <span
                  class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm font-semibold text-muted"
                >
                  zł
                </span>
              </div>
            </div>

            <!-- Kwota i procent -->
            <div class="mt-4 flex items-center justify-between gap-4 text-sm">
              <p class="mb-0 text-muted">
                Wpisana kwota:
                <strong class="text-brand">
                  {{ formatPrice(ownContribution || 0) }} zł
                </strong>
              </p>

              <div
                class="grid min-h-11 min-w-[78px] place-items-center rounded-[6px] border border-line bg-page px-4 font-display text-xl text-brand"
              >
                {{ contributionPercent }}%
              </div>
            </div>

            <!-- Pasek procentowy -->
            <div class="mt-4 h-2 overflow-hidden rounded-full bg-line">
              <div
                class="h-full rounded-full bg-brand transition-[width] duration-300"
                :style="{ width: `${contributionPercent}%` }"
              ></div>
            </div>

            <!-- Ostrzeżenie -->
            <p
              v-if="hasLowContribution"
              class="mt-5 mb-0 border-l-2 border-gold bg-[rgba(199,157,98,0.1)] px-4 py-3 text-sm text-muted"
            >
              Wkład własny wynosi mniej niż 20% ceny mieszkania.
            </p>

            <!-- Podsumowanie finansowania -->
            <div class="mt-7 grid gap-4 sm:grid-cols-2">
              <div class="rounded-[6px] bg-page p-5">
                <strong
                  class="block font-display text-2xl font-normal text-brand"
                >
                  {{ formatPrice(ownContribution || 0) }} zł
                </strong>

                <span class="mt-1 block text-xs text-muted">
                  wkładu własnego
                </span>
              </div>

              <div class="rounded-[6px] bg-page p-5">
                <strong
                  class="block font-display text-2xl font-normal text-brand"
                >
                  {{ formatPrice(neededLoan) }} zł
                </strong>

                <span class="mt-1 block text-xs text-muted">
                  potrzebnego kredytu
                </span>
              </div>
            </div>
          </section>

          <section
            class="mt-4 rounded-[14px] border border-line bg-panel p-[clamp(22px,3vw,32px)] shadow-[0_10px_35px_rgba(23,63,53,0.06)]"
          >
            <!-- Nagłówek -->
            <div class="flex items-start gap-4">
              <span
                class="grid size-11 shrink-0 place-items-center rounded-full bg-page font-display text-xl text-brand"
                aria-hidden="true"
              >
                3
              </span>

              <div>
                <h2 class="mb-1 text-[clamp(25px,3vw,32px)]">Wykończenie</h2>

                <p class="mb-0 text-sm text-muted">
                  Wybierz standard wykończenia lub wpisz własną stawkę za m².
                </p>
              </div>
            </div>

            <!-- Standardy -->
            <div class="mt-8 grid gap-4 sm:grid-cols-3">
              <button
                v-for="standard in finishingStandards"
                :key="standard.name"
                class="group relative overflow-hidden rounded-[8px] border p-5 text-left transition-[border-color,background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5"
                :class="
                  finishingCostPerMeter === standard.price
                    ? 'border-brand bg-[rgba(23,63,53,0.05)] shadow-[0_8px_24px_rgba(23,63,53,0.08)]'
                    : 'border-line bg-panel hover:border-gold'
                "
                type="button"
                @click="selectFinishingStandard(standard.price)"
              >
                <!-- Górna linia aktywnego kafelka -->
                <span
                  v-if="finishingCostPerMeter === standard.price"
                  class="absolute top-0 right-0 left-0 h-[3px] bg-brand"
                  aria-hidden="true"
                ></span>

                <div class="flex items-start justify-between gap-3">
                  <span class="block text-sm font-bold text-brand">
                    {{ standard.name }}
                  </span>

                  <span
                    v-if="finishingCostPerMeter === standard.price"
                    class="rounded-full bg-brand px-2.5 py-1 text-[9px] font-bold tracking-[0.08em] text-panel uppercase"
                  >
                    Wybrany
                  </span>
                </div>

                <strong
                  class="mt-4 block font-display text-[clamp(21px,2vw,26px)] font-normal text-brand"
                >
                  {{ formatPrice(standard.price) }}
                  <span class="font-copy text-xs font-semibold text-muted">
                    zł/m²
                  </span>
                </strong>

                <span class="mt-2 block text-xs text-muted">
                  Szacowany standard wykończenia
                </span>
              </button>
            </div>

            <!-- Własna stawka i wynik -->
            <div class="mt-7 grid items-end gap-4 sm:grid-cols-2">
              <div>
                <label
                  for="finishing-cost"
                  class="mb-2 block text-sm font-semibold text-[var(--color-text)]"
                >
                  Koszt za m²
                </label>

                <div class="relative">
                  <input
                    id="finishing-cost"
                    v-model.number="finishingCostPerMeter"
                    class="min-h-[54px] w-full rounded-[6px] border border-line bg-panel py-3 pr-20 pl-4 font-semibold text-[var(--color-text)] transition-colors outline-none hover:border-gold focus:border-brand"
                    type="number"
                    min="0"
                    step="100"
                  />

                  <span
                    class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm font-semibold text-muted"
                  >
                    zł/m²
                  </span>
                </div>
              </div>

              <div class="min-h-[78px] rounded-[6px] bg-page px-5 py-4">
                <span class="block text-xs text-muted">
                  Szacowany koszt wykończenia
                </span>

                <strong
                  class="mt-1 block font-display text-2xl font-normal text-brand"
                >
                  {{ formatPrice(totalFinishingCost) }} zł
                </strong>
              </div>
            </div>

            <!-- Sposób obliczenia -->
            <p class="mt-4 mb-0 text-xs text-muted">
              {{ selectedApartment.area }} m² ×
              {{ formatPrice(finishingCostPerMeter || 0) }} zł/m²
            </p>
          </section>

          <section
            class="mt-4 rounded-[14px] border border-line bg-panel p-[clamp(22px,3vw,32px)] shadow-[0_10px_35px_rgba(23,63,53,0.06)]"
          >
            <!-- Nagłówek -->
            <div class="flex items-start gap-4">
              <span
                class="grid size-11 shrink-0 place-items-center rounded-full bg-page font-display text-xl text-brand"
                aria-hidden="true"
              >
                4
              </span>

              <div>
                <h2 class="mb-1 text-[clamp(25px,3vw,32px)]">
                  Koszty dodatkowe
                </h2>

                <p class="mb-0 text-sm text-muted">
                  Uwzględnij dodatkowe opłaty związane z zakupem mieszkania.
                </p>
              </div>
            </div>

            <div class="mt-8 divide-y divide-line">
              <!-- Parking -->
              <div
                class="grid items-center gap-4 py-4 sm:grid-cols-[minmax(0,1fr)_230px]"
              >
                <label
                  class="flex cursor-pointer items-center gap-3"
                  for="include-parking"
                >
                  <input
                    id="include-parking"
                    v-model="includeParkingSpace"
                    class="peer sr-only"
                    type="checkbox"
                  />

                  <span
                    class="grid size-5 shrink-0 place-items-center rounded-[4px] border border-line bg-panel text-xs text-transparent transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-panel"
                    aria-hidden="true"
                  >
                    ✓
                  </span>

                  <span class="text-sm font-semibold text-[var(--color-text)]">
                    Miejsce parkingowe
                  </span>
                </label>

                <div class="relative">
                  <input
                    id="parking-price"
                    v-model.number="parkingSpacePrice"
                    class="min-h-[48px] w-full rounded-[6px] border border-line bg-panel py-2 pr-12 pl-4 text-sm font-semibold text-[var(--color-text)] transition-colors outline-none hover:border-gold focus:border-brand disabled:cursor-not-allowed disabled:bg-page disabled:text-muted"
                    type="number"
                    min="0"
                    step="1000"
                    :disabled="!includeParkingSpace"
                  />

                  <span
                    class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-muted"
                  >
                    zł
                  </span>
                </div>
              </div>

              <!-- Komórka lokatorska -->
              <div
                class="grid items-center gap-4 py-4 sm:grid-cols-[minmax(0,1fr)_230px]"
              >
                <label
                  class="flex cursor-pointer items-center gap-3"
                  for="include-storage-room"
                >
                  <input
                    id="include-storage-room"
                    v-model="includeStorageRoom"
                    class="peer sr-only"
                    type="checkbox"
                  />

                  <span
                    class="grid size-5 shrink-0 place-items-center rounded-[4px] border border-line bg-panel text-xs text-transparent transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-panel"
                    aria-hidden="true"
                  >
                    ✓
                  </span>

                  <span class="text-sm font-semibold text-[var(--color-text)]">
                    Komórka lokatorska
                  </span>
                </label>

                <div class="relative">
                  <input
                    id="storage-room-price"
                    v-model.number="storageRoomPrice"
                    class="min-h-[48px] w-full rounded-[6px] border border-line bg-panel py-2 pr-12 pl-4 text-sm font-semibold text-[var(--color-text)] transition-colors outline-none hover:border-gold focus:border-brand disabled:cursor-not-allowed disabled:bg-page disabled:text-muted"
                    type="number"
                    min="0"
                    step="1000"
                    :disabled="!includeStorageRoom"
                  />

                  <span
                    class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-muted"
                  >
                    zł
                  </span>
                </div>
              </div>

              <!-- Notariusz -->
              <div
                class="grid items-center gap-4 py-4 sm:grid-cols-[minmax(0,1fr)_230px]"
              >
                <label
                  for="notary-fee"
                  class="text-sm font-semibold text-[var(--color-text)]"
                >
                  Notariusz i dokumenty
                </label>

                <div class="relative">
                  <input
                    id="notary-fee"
                    v-model.number="notaryFee"
                    class="min-h-[48px] w-full rounded-[6px] border border-line bg-panel py-2 pr-12 pl-4 text-sm font-semibold text-[var(--color-text)] transition-colors outline-none hover:border-gold focus:border-brand"
                    type="number"
                    min="0"
                    step="100"
                  />

                  <span
                    class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-muted"
                  >
                    zł
                  </span>
                </div>
              </div>
            </div>

            <!-- Suma -->
            <div
              class="mt-5 flex flex-col justify-between gap-3 rounded-[6px] bg-page p-5 sm:flex-row sm:items-center"
            >
              <span class="text-sm font-semibold text-muted">
                Łączne koszty dodatkowe
              </span>

              <strong class="font-display text-2xl font-normal text-brand">
                {{ formatPrice(totalAdditionalCosts) }} zł
              </strong>
            </div>
          </section>
        </div>

        <aside
          class="bg-brand p-[clamp(24px,4vw,48px)] text-panel lg:sticky lg:top-[112px]"
        >
          <p
            class="mb-3 text-xs font-bold tracking-[0.16em] text-gold uppercase"
          >
            Podsumowanie
          </p>

          <h2 class="text-[clamp(30px,4vw,46px)] text-panel">Twój budżet</h2>

          <p class="mb-0 text-white/70">
            Wyniki pojawią się po uzupełnieniu kalkulatora.
          </p>
        </aside>
      </div>
    </section>
  </main>
</template>
