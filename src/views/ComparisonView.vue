<script setup>
import { computed } from 'vue'
import { apartments } from '../data/apartments'
import { useComparison } from '../composables/useComparison'
import {
  formatPrice,
  formatPricePerMeter,
  getFloorLabel,
  getRoomsLabel
} from '../utils/apartmentFormatters'
import {
  apartmentStatusClasses,
  apartmentStatusLabels
} from '../constants/apartmentStatuses'

const { comparisonApartmentIds, toggleComparison, clearComparison } =
  useComparison()

const comparedApartments = computed(() =>
  comparisonApartmentIds.value
    .map((id) => apartments.find((apartment) => apartment.id === id))
    .filter(Boolean)
)

const bestComparisonValues = computed(() => {
  if (comparedApartments.value.length < 2) {
    return null
  }

  return {
    lowestPrice: Math.min(
      ...comparedApartments.value.map((apartment) => apartment.price)
    ),

    largestArea: Math.max(
      ...comparedApartments.value.map((apartment) => apartment.area)
    ),

    lowestPricePerMeter: Math.min(
      ...comparedApartments.value.map(
        (apartment) => apartment.price / apartment.area
      )
    )
  }
})
</script>

<template>
  <main class="min-h-screen pt-[140px] pb-20 max-sm:pt-[120px]">
    <div class="container">
      <div class="mb-[50px] max-w-[720px]">
        <p
          class="mb-4 text-[11px] font-bold tracking-[0.13em] text-gold uppercase"
        >
          Twoja lista
        </p>

        <h1 class="mb-5 text-[clamp(38px,5vw,64px)]">Porównaj mieszkania</h1>

        <p class="max-w-[620px] text-sm leading-relaxed text-muted">
          Zestaw najważniejsze parametry wybranych mieszkań i łatwiej wybierz
          najlepszą ofertę.
        </p>
      </div>

      <div
        v-if="comparedApartments.length > 0"
        class="mb-6 flex justify-end"
      >
        <button
          class="border-0 bg-transparent text-sm font-semibold text-muted underline decoration-brand/30 underline-offset-4 transition-colors hover:text-brand"
          type="button"
          @click="clearComparison"
        >
          Wyczyść porównanie
        </button>
      </div>

      <p
        v-if="comparedApartments.length === 0"
        class="text-sm leading-relaxed text-muted"
      >
        Nie wybrano jeszcze żadnych mieszkań do porównania.
      </p>

      <div
        v-else
        class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="apartment in comparedApartments"
          :key="apartment.id"
          class="relative border border-brand/10 bg-panel p-5 shadow-[0_14px_40px_rgba(23,63,53,0.08)]"
        >
          <button
            class="absolute top-4 right-4 grid size-8 place-items-center rounded-full border border-brand/10 text-lg leading-none text-muted transition-colors hover:border-brand hover:text-brand"
            type="button"
            :aria-label="`Usuń mieszkanie ${apartment.number} z porównania`"
            title="Usuń z porównania"
            @click="toggleComparison(apartment.id)"
          >
            ×
          </button>

          <p
            class="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold"
          >
            Mieszkanie
          </p>

          <h2 class="pr-10 text-2xl text-brand">
            {{ apartment.number }}
          </h2>

          <p class="mt-2 text-sm text-muted">
            {{ apartment.investment }}
          </p>

          <dl class="mt-6 divide-y divide-brand/10 border-y border-brand/10">
            <div class="flex items-center justify-between gap-4 py-3">
              <dt class="text-sm text-muted">Cena</dt>

              <dd
                class="rounded px-2 py-1 text-right font-semibold text-brand"
                :class="{
                  'bg-gold/15 text-brand':
                    apartment.price === bestComparisonValues?.lowestPrice
                }"
              >
                {{ formatPrice(apartment.price) }} zł
              </dd>
            </div>

            <div class="flex items-center justify-between gap-4 py-3">
              <dt class="text-sm text-muted">Powierzchnia</dt>

              <dd
                class="rounded px-2 py-1 text-right font-semibold text-brand"
                :class="{
                  'bg-gold/15 text-brand':
                    apartment.area === bestComparisonValues?.largestArea
                }"
              >
                {{ apartment.area }} m²
              </dd>
            </div>

            <div class="flex items-center justify-between gap-4 py-3">
              <dt class="text-sm text-muted">Liczba pokoi</dt>

              <dd class="text-right font-semibold text-brand">
                {{ apartment.rooms }} {{ getRoomsLabel(apartment.rooms) }}
              </dd>
            </div>

            <div class="flex items-center justify-between gap-4 py-3">
              <dt class="text-sm text-muted">Piętro</dt>

              <dd class="text-right font-semibold text-brand">
                {{ getFloorLabel(apartment.floor) }}
              </dd>
            </div>

            <div class="flex items-center justify-between gap-4 py-3">
              <dt class="text-sm text-muted">Cena za m²</dt>

              <dd
                class="rounded px-2 py-1 text-right font-semibold text-brand"
                :class="{
                  'bg-gold/15 text-brand':
                    apartment.price / apartment.area ===
                    bestComparisonValues?.lowestPricePerMeter
                }"
              >
                {{ formatPricePerMeter(apartment.price, apartment.area) }} zł/m²
              </dd>
            </div>

            <div class="flex items-center justify-between gap-4 py-3">
              <dt class="text-sm text-muted">Status</dt>

              <dd>
                <span
                  class="inline-flex items-center px-3 py-[7px] text-[10px] font-bold tracking-[0.08em] text-white uppercase"
                  :class="apartmentStatusClasses[apartment.status]"
                >
                  {{ apartmentStatusLabels[apartment.status] }}
                </span>
              </dd>
            </div>
          </dl>

          <RouterLink
            class="mt-5 inline-flex text-sm font-semibold text-brand underline decoration-gold underline-offset-4"
            :to="{
              name: 'apartment-details',
              params: { slug: apartment.slug }
            }"
          >
            Zobacz mieszkanie
          </RouterLink>
        </article>

        <RouterLink
          v-if="comparedApartments.length < 3"
          class="group flex min-h-[320px] flex-col items-center justify-center border border-dashed border-brand/25 bg-transparent p-6 text-center transition-colors hover:border-brand hover:bg-brand/[0.03]"
          to="/mieszkania"
        >
          <span
            class="grid size-12 place-items-center rounded-full border border-brand/20 text-2xl text-brand transition-transform group-hover:scale-105"
            aria-hidden="true"
          >
            +
          </span>

          <strong class="mt-4 text-brand"> Dodaj kolejne mieszkanie </strong>

          <span class="mt-2 max-w-[220px] text-sm text-muted">
            Możesz porównać maksymalnie trzy mieszkania.
          </span>
        </RouterLink>
      </div>
    </div>
  </main>
</template>
