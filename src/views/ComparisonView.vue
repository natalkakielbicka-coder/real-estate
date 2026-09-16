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

const { comparisonApartmentIds, toggleComparison } = useComparison()

const comparedApartments = computed(() =>
  comparisonApartmentIds.value
    .map((id) => apartments.find((apartment) => apartment.id === id))
    .filter(Boolean)
)
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

      <p
        v-if="comparedApartments.length === 0"
        class="text-muted"
      >
        Nie wybrano jeszcze żadnych mieszkań do porównania.
      </p>

      <div
        v-else
        class="grid gap-4"
        :class="{
          'md:grid-cols-2': comparedApartments.length === 2,
          'md:grid-cols-3': comparedApartments.length === 3
        }"
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

              <dd class="text-right font-semibold text-brand">
                {{ formatPrice(apartment.price) }}
              </dd>
            </div>

            <div class="flex items-center justify-between gap-4 py-3">
              <dt class="text-sm text-muted">Powierzchnia</dt>

              <dd class="text-right font-semibold text-brand">
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

              <dd class="text-right font-semibold text-brand">
                {{ formatPricePerMeter(apartment.price, apartment.area) }} zł
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
            :to="`/mieszkania/${apartment.id}`"
          >
            Zobacz mieszkanie
          </RouterLink>
        </article>
      </div>
    </div>
  </main>
</template>
