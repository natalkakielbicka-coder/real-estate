<script setup>
import { ref, computed } from 'vue'
import { apartments } from '../data/apartments'
import CalculatorApartmentStep from '../components/CalculatorApartmentStep.vue'
import PurchaseCostChart from '../components/PurchaseCostChart.vue'
import { useToast } from '../composables/useToast'

const { showToast } = useToast()

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

const handleInvestmentChange = (investmentName) => {
  selectedInvestment.value = investmentName

  const firstApartment = apartmentsFromSelectedInvestment.value[0]

  selectedApartmentId.value = firstApartment?.id ?? null
}

const handleApartmentChange = (apartmentId) => {
  const apartment = apartmentsFromSelectedInvestment.value.find((item) => {
    return String(item.id) === String(apartmentId)
  })

  selectedApartmentId.value = apartment?.id ?? null
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

const totalPurchaseCost = computed(() => {
  if (!selectedApartment.value) {
    return 0
  }

  return (
    selectedApartment.value.price +
    totalFinishingCost.value +
    totalAdditionalCosts.value
  )
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

const resetCalculator = () => {
  selectedInvestment.value = availableInvestments[0]

  const firstApartment = availableApartments.find((apartment) => {
    return apartment.investment === selectedInvestment.value
  })

  selectedApartmentId.value = firstApartment?.id ?? null

  ownContribution.value = 100000
  finishingCostPerMeter.value = 2500
  notaryFee.value = 4000

  includeParkingSpace.value = false
  parkingSpacePrice.value = 35000

  includeStorageRoom.value = false
  storageRoomPrice.value = 15000

  showToast('Kalkulator został zresetowany', 'info')
}

const saveCalculation = () => {
  const calculation = {
    selectedInvestment: selectedInvestment.value,
    selectedApartmentId: selectedApartmentId.value,
    ownContribution: ownContribution.value,
    finishingCostPerMeter: finishingCostPerMeter.value,
    notaryFee: notaryFee.value,
    includeParkingSpace: includeParkingSpace.value,
    parkingSpacePrice: parkingSpacePrice.value,
    includeStorageRoom: includeStorageRoom.value,
    storageRoomPrice: storageRoomPrice.value
  }

  localStorage.setItem('purchase-calculation', JSON.stringify(calculation))

  showToast('Kalkulacja została zapisana')
}
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
          <CalculatorApartmentStep
            :investments="availableInvestments"
            :apartments="apartmentsFromSelectedInvestment"
            :selected-investment="selectedInvestment"
            :selected-apartment-id="selectedApartmentId"
            :selected-apartment="selectedApartment"
            @select-investment="handleInvestmentChange"
            @select-apartment="handleApartmentChange"
          />

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
          class="rounded-[14px] border border-line bg-panel p-[clamp(24px,3vw,32px)] shadow-[0_10px_35px_rgba(23,63,53,0.08)] lg:sticky lg:top-[112px]"
        >
          <!-- Wynik -->
          <p
            class="mb-4 text-[10px] font-bold tracking-[0.24em] text-muted uppercase"
          >
            Twój wynik
          </p>

          <strong
            class="block font-display text-[clamp(42px,5vw,62px)] font-normal leading-none text-brand"
          >
            {{ formatPrice(totalPurchaseCost) }} zł
          </strong>

          <p class="mt-3 mb-0 text-sm text-[var(--color-text)]">
            Całkowity koszt zakupu
          </p>

          <!-- Wykres i legenda -->
          <div class="mt-8">
            <PurchaseCostChart
              v-if="selectedApartment"
              :apartment-price="selectedApartment.price"
              :finishing-cost="totalFinishingCost"
              :additional-costs="totalAdditionalCosts"
              :total-cost="totalPurchaseCost"
            />
          </div>

          <!-- Szczegółowe koszty -->
          <div class="mt-8 border-t border-line pt-5">
            <dl class="divide-y divide-line">
              <div class="flex justify-between gap-5 py-3 text-sm">
                <dt class="text-[var(--color-text)]">Cena mieszkania</dt>

                <dd
                  class="m-0 text-right font-semibold text-[var(--color-text)]"
                >
                  {{ formatPrice(selectedApartment?.price || 0) }} zł
                </dd>
              </div>

              <div class="flex justify-between gap-5 py-3 text-sm">
                <dt class="text-[var(--color-text)]">Wykończenie</dt>

                <dd
                  class="m-0 text-right font-semibold text-[var(--color-text)]"
                >
                  {{ formatPrice(totalFinishingCost) }} zł
                </dd>
              </div>

              <div class="flex justify-between gap-5 py-3 text-sm">
                <dt class="flex items-center gap-2 text-[var(--color-text)]">
                  PCC

                  <span
                    class="grid size-4 place-items-center rounded-full border border-muted text-[9px] text-muted"
                    title="Podatek od czynności cywilnoprawnych"
                  >
                    i
                  </span>
                </dt>

                <dd
                  class="m-0 text-right font-semibold text-[var(--color-text)]"
                >
                  0 zł
                </dd>
              </div>

              <div class="flex justify-between gap-5 py-3 text-sm">
                <dt class="text-[var(--color-text)]">Pozostałe koszty</dt>

                <dd
                  class="m-0 text-right font-semibold text-[var(--color-text)]"
                >
                  {{ formatPrice(totalAdditionalCosts) }} zł
                </dd>
              </div>
            </dl>
          </div>

          <!-- Kredyt -->
          <div
            class="mt-5 flex items-center justify-between gap-4 rounded-[6px] bg-brand px-5 py-4 text-panel shadow-[0_8px_24px_rgba(23,63,53,0.18)]"
          >
            <span class="text-sm font-semibold"> Potrzebny kredyt </span>

            <strong class="font-display text-2xl font-normal">
              {{ formatPrice(neededLoan) }} zł
            </strong>
          </div>
          <button
            class="group mt-5 flex min-h-[54px] w-full items-center justify-center gap-3 rounded-[6px] bg-gold px-5 text-sm font-semibold text-panel shadow-[0_8px_24px_rgba(199,157,98,0.2)] transition-[background-color,transform,box-shadow] hover:bg-[#b98e52] hover:shadow-[0_12px_28px_rgba(199,157,98,0.28)]"
            type="button"
            @click="saveCalculation"
          >
            <svg
              class="size-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M5 3h12l2 2v16H5z" />
              <path d="M8 3v6h8V3" />
              <path d="M8 21v-7h8v7" />
            </svg>

            Zapisz kalkulację
          </button>

          <button
            class="group mt-4 flex min-h-[54px] w-full items-center justify-center gap-3 rounded-[6px] border border-line bg-panel px-5 text-sm font-semibold text-[var(--color-text)] transition-[border-color,color,background-color] hover:border-brand hover:bg-page hover:text-brand"
            type="button"
            @click="resetCalculator"
          >
            <svg
              class="size-[18px] transition-transform duration-300 group-hover:-rotate-90"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 4v6h6" />
            </svg>

            Resetuj
          </button>
        </aside>
      </div>
    </section>
  </main>
</template>
