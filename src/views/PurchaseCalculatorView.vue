<script setup>
import { ref, computed } from 'vue'
import { apartments } from '../data/apartments'

const formatPrice = (price) => {
  const formattedPrice = new Intl.NumberFormat('pl-PL').format(price)

  return formattedPrice
}

const availableApartments = apartments.filter((apartment) => {
  return apartment.status === 'available'
})

const firstAvailableApartment = availableApartments[0]
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
  return availableApartments.find((apartment) => {
    return apartment.id === selectedApartmentId.value
  })
})

const neededLoan = computed(() => {
  const apartmentPrice = selectedApartment.value.price
  const contribution = ownContribution.value || 0
  const loanAmount = apartmentPrice - contribution

  return Math.max(loanAmount, 0)
})

const totalFinishingCost = computed(() => {
  const apartmentArea = selectedApartment.value.area
  const costPerMeter = finishingCostPerMeter.value || 0

  return apartmentArea * costPerMeter
})

const contributionPercent = computed(() => {
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
        <div class="bg-panel p-[clamp(24px,4vw,48px)]">
          <p
            class="mb-3 text-xs font-bold tracking-[0.16em] text-gold uppercase"
          >
            Krok 01
          </p>

          <h2 class="text-[clamp(30px,4vw,46px)]">Wybierz mieszkanie</h2>

          <div>
            <div>
              <label
                for="apartment"
                class="mb-5 mt-2 block text-sm text-muted"
              >
                Wybierz lokal z aktualnie dostępnych mieszkań
              </label>

              <div class="relative">
                <select
                  id="apartment"
                  v-model="selectedApartmentId"
                  class="min-h-[62px] w-full appearance-none border border-line bg-panel py-3 pr-14 pl-5 text-sm font-semibold text-[var(--color-text)] transition-colors outline-none hover:border-gold focus:border-gold"
                >
                  <option
                    v-for="apartment in availableApartments"
                    :key="apartment.id"
                    :value="apartment.id"
                  >
                    {{ apartment.investment }} — lokal {{ apartment.number }} —
                    {{ formatPrice(apartment.price) }} zł
                  </option>
                </select>

                <span
                  class="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-xl text-gold"
                  aria-hidden="true"
                >
                  ↓
                </span>
              </div>
            </div>

            <div
              v-if="selectedApartment"
              class="mt-8 border border-line bg-page p-6"
            >
              <p
                class="mb-2 text-xs font-bold tracking-[0.14em] text-gold uppercase"
              >
                Wybrane mieszkanie
              </p>

              <h3 class="mb-2">
                {{ selectedApartment.investment }}
              </h3>

              <p class="mb-4 text-muted">
                Lokal {{ selectedApartment.number }}
              </p>

              <p class="mb-0">
                Cena mieszkania:
                <strong class="text-brand">
                  {{ formatPrice(selectedApartment.price) }} zł
                </strong>
              </p>

              <dl
                class="mt-6 grid grid-cols-2 gap-5 border-t border-line pt-5 sm:grid-cols-3"
              >
                <div>
                  <dt class="mb-1 text-xs text-muted">Powierzchnia</dt>

                  <dd class="m-0 font-bold text-brand">
                    {{ selectedApartment.area }} m²
                  </dd>
                </div>

                <div>
                  <dt class="mb-1 text-xs text-muted">Liczba pokoi</dt>

                  <dd class="m-0 font-bold text-brand">
                    {{ selectedApartment.rooms }}
                  </dd>
                </div>

                <div>
                  <dt class="mb-1 text-xs text-muted">Piętro</dt>

                  <dd class="m-0 font-bold text-brand">
                    {{
                      selectedApartment.floor === 0
                        ? 'Parter'
                        : `${selectedApartment.floor}. piętro`
                    }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="mt-10 border-t border-line pt-10">
            <p
              class="mb-3 text-xs font-bold tracking-[0.16em] text-gold uppercase"
            >
              Krok 02
            </p>

            <h2 class="text-[clamp(30px,4vw,46px)]">Finansowanie</h2>

            <div class="mt-7">
              <label
                for="own-contribution"
                class="mb-3 block text-sm font-bold text-brand"
              >
                Wkład własny
              </label>

              <div class="relative">
                <input
                  id="own-contribution"
                  v-model.number="ownContribution"
                  class="min-h-[62px] w-full border border-line bg-panel py-3 pr-16 pl-5 font-semibold text-[var(--color-text)] transition-colors outline-none hover:border-gold focus:border-gold"
                  type="number"
                  min="0"
                  step="1000"
                />

                <span
                  class="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-sm font-bold text-muted"
                >
                  zł
                </span>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between gap-4 text-sm">
              <p class="mb-0 text-muted">
                Wpisana kwota:
                <strong class="text-brand">
                  {{ formatPrice(ownContribution || 0) }} zł
                </strong>
              </p>

              <p class="mb-0 font-bold text-gold">{{ contributionPercent }}%</p>
            </div>

            <div class="mt-3 h-2 overflow-hidden bg-line">
              <div
                class="h-full bg-gold transition-[width] duration-300"
                :style="{ width: `${contributionPercent}%` }"
              ></div>
            </div>

            <p
              v-if="hasLowContribution"
              class="mt-4 mb-0 border-l-2 border-gold bg-[rgba(199,157,98,0.1)] px-4 py-3 text-sm text-muted"
            >
              Wkład własny wynosi mniej niż 20% ceny mieszkania.
            </p>

            <div class="mt-6 bg-page p-5">
              <p class="mb-1 text-sm text-muted">Potrzebny kredyt</p>

              <strong class="font-display text-3xl font-normal text-brand">
                {{ formatPrice(neededLoan) }} zł
              </strong>
            </div>
          </div>

          <div class="mt-10 border-t border-line pt-10">
            <p
              class="mb-3 text-xs font-bold tracking-[0.16em] text-gold uppercase"
            >
              Krok 03
            </p>

            <h2 class="text-[clamp(30px,4vw,46px)]">Wykończenie</h2>

            <p class="mb-7 max-w-[620px] text-muted">
              Określ przewidywany koszt wykończenia jednego metra kwadratowego.
            </p>

            <div>
              <div class="mb-7 grid gap-3 sm:grid-cols-3">
                <button
                  v-for="standard in finishingStandards"
                  :key="standard.name"
                  class="border px-4 py-4 text-left transition-colors"
                  :class="
                    finishingCostPerMeter === standard.price
                      ? 'border-gold bg-[rgba(199,157,98,0.1)]'
                      : 'border-line bg-panel hover:border-gold'
                  "
                  type="button"
                  @click="selectFinishingStandard(standard.price)"
                >
                  <span class="block text-sm font-bold text-brand">
                    {{ standard.name }}
                  </span>

                  <span class="mt-1 block text-xs text-muted">
                    {{ formatPrice(standard.price) }} zł/m²
                  </span>
                </button>
              </div>
              <label
                for="finishing-cost"
                class="mb-3 block text-sm font-bold text-brand"
              >
                Koszt wykończenia za m²
              </label>

              <div class="relative">
                <input
                  id="finishing-cost"
                  v-model.number="finishingCostPerMeter"
                  class="min-h-[62px] w-full border border-line bg-panel py-3 pr-24 pl-5 font-semibold text-[var(--color-text)] transition-colors outline-none hover:border-gold focus:border-gold"
                  type="number"
                  min="0"
                  step="100"
                />

                <span
                  class="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-sm font-bold text-muted"
                >
                  zł/m²
                </span>
              </div>
            </div>

            <p class="mt-4 mb-0 text-sm text-muted">
              Wybrana stawka:
              <strong class="text-brand">
                {{ formatPrice(finishingCostPerMeter || 0) }} zł/m²
              </strong>
            </p>

            <div class="mt-6 bg-page p-5">
              <p class="mb-1 text-sm text-muted">Szacowany koszt wykończenia</p>

              <strong class="font-display text-3xl font-normal text-brand">
                {{ formatPrice(totalFinishingCost) }} zł
              </strong>

              <p class="mt-2 mb-0 text-xs text-muted">
                {{ selectedApartment.area }} m² ×
                {{ formatPrice(finishingCostPerMeter || 0) }} zł/m²
              </p>
            </div>
          </div>

          <div class="mt-10 border-t border-line pt-10">
            <p
              class="mb-3 text-xs font-bold tracking-[0.16em] text-gold uppercase"
            >
              Krok 04
            </p>

            <h2 class="text-[clamp(30px,4vw,46px)]">Koszty dodatkowe</h2>

            <p class="mb-7 max-w-[620px] text-muted">
              Dodaj opłaty związane z zakupem mieszkania.
            </p>

            <div>
              <label
                for="notary-fee"
                class="mb-3 block text-sm font-bold text-brand"
              >
                Notariusz i dokumenty
              </label>

              <div class="relative">
                <input
                  id="notary-fee"
                  v-model.number="notaryFee"
                  class="min-h-[62px] w-full border border-line bg-panel py-3 pr-16 pl-5 font-semibold text-[var(--color-text)] transition-colors outline-none hover:border-gold focus:border-gold"
                  type="number"
                  min="0"
                  step="100"
                />

                <span
                  class="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-sm font-bold text-muted"
                >
                  zł
                </span>
              </div>
            </div>

            <p class="mt-4 mb-0 text-sm text-muted">
              Koszt notarialny:
              <strong class="text-brand">
                {{ formatPrice(notaryFee || 0) }} zł
              </strong>
            </p>

            <div class="mt-7 border-t border-line pt-7">
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
                  class="grid size-5 shrink-0 place-items-center border border-line bg-panel text-xs text-transparent transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-panel"
                  aria-hidden="true"
                >
                  ✓
                </span>

                <span class="text-sm font-bold text-brand">
                  Dodaj miejsce parkingowe
                </span>
              </label>

              <div
                v-if="includeParkingSpace"
                class="mt-5"
              >
                <label
                  for="parking-price"
                  class="mb-3 block text-sm font-bold text-brand"
                >
                  Cena miejsca parkingowego
                </label>

                <div class="relative">
                  <input
                    id="parking-price"
                    v-model.number="parkingSpacePrice"
                    class="min-h-[62px] w-full border border-line bg-panel py-3 pr-16 pl-5 font-semibold text-[var(--color-text)] transition-colors outline-none hover:border-gold focus:border-gold"
                    type="number"
                    min="0"
                    step="1000"
                  />

                  <span
                    class="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-sm font-bold text-muted"
                  >
                    zł
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-7 border-t border-line pt-7">
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
                class="grid size-5 shrink-0 place-items-center border border-line bg-panel text-xs text-transparent transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-panel"
                aria-hidden="true"
              >
                ✓
              </span>

              <span class="text-sm font-bold text-brand">
                Dodaj komórkę lokatorską
              </span>
            </label>

            <div
              v-if="includeStorageRoom"
              class="mt-5"
            >
              <label
                for="storage-room-price"
                class="mb-3 block text-sm font-bold text-brand"
              >
                Cena komórki lokatorskiej
              </label>

              <div class="relative">
                <input
                  id="storage-room-price"
                  v-model.number="storageRoomPrice"
                  class="min-h-[62px] w-full border border-line bg-panel py-3 pr-16 pl-5 font-semibold text-[var(--color-text)] transition-colors outline-none hover:border-gold focus:border-gold"
                  type="number"
                  min="0"
                  step="1000"
                />

                <span
                  class="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-sm font-bold text-muted"
                >
                  zł
                </span>
              </div>
            </div>
          </div>
          <div class="mt-8 bg-page p-5">
            <p class="mb-1 text-sm text-muted">Łączne koszty dodatkowe</p>

            <strong class="font-display text-3xl font-normal text-brand">
              {{ formatPrice(totalAdditionalCosts) }} zł
            </strong>
          </div>
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
