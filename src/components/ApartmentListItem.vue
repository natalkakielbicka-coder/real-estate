<script setup>
import {
  apartmentStatusLabels,
  apartmentStatusClasses
} from '../constants/apartmentStatuses'
import {
  getFloorLabel,
  formatPrice,
  formatPricePerMeter
} from '../utils/apartmentFormatters'

defineProps({
  apartment: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article
    class="grid min-h-[190px] grid-cols-1 bg-panel shadow-[0_12px_35px_rgba(23,63,53,0.07)] transition-shadow duration-[250ms] hover:shadow-[0_18px_45px_rgba(23,63,53,0.12)] xs:grid-cols-[110px_minmax(0,1fr)] sm:grid-cols-[140px_minmax(0,1fr)] md:grid-cols-[170px_minmax(0,1fr)_210px]"
  >
    <div
      class="apartment-list-item__number flex min-h-[150px] flex-col items-center justify-center p-6 xs:min-h-0"
    >
      <span class="text-[9px] font-bold text-muted uppercase">
        Budynek {{ apartment.building }}
      </span>

      <strong class="my-[5px] font-display text-[45px] font-normal text-brand">
        {{ apartment.number }}
      </strong>

      <small class="text-[9px] font-bold text-muted uppercase">
        {{ getFloorLabel(apartment.floor) }}
      </small>
    </div>

    <div class="p-[22px] sm:p-7">
      <div
        class="flex flex-col-reverse items-start justify-between gap-2.5 sm:flex-row sm:gap-5"
      >
        <div>
          <p class="mb-[5px] text-[10px] font-bold text-gold uppercase">
            {{ apartment.investment }}
          </p>

          <h2 class="mb-0 text-[28px]">Mieszkanie {{ apartment.number }}</h2>
        </div>

        <span
          class="shrink-0 px-2.5 py-[7px] text-[8px] font-bold text-white uppercase"
          :class="apartmentStatusClasses[apartment.status]"
        >
          {{ apartmentStatusLabels[apartment.status] }}
        </span>
      </div>

      <p class="mt-2 mb-[22px] text-[11px] text-muted">
        {{ apartment.city }}, {{ apartment.district }}
      </p>

      <div class="flex flex-wrap gap-x-[25px] gap-y-2.5 text-[10px] text-muted">
        <span>
          <strong class="mr-[3px] text-xs text-brand">
            {{ apartment.rooms }}
          </strong>
          pokoje
        </span>

        <span>
          <strong class="mr-[3px] text-xs text-brand">
            {{ apartment.area }} m²
          </strong>
          powierzchni
        </span>

        <span>
          <strong class="mr-[3px] text-xs text-brand">
            {{ getFloorLabel(apartment.floor) }}
          </strong>
          kondygnacja
        </span>
      </div>
    </div>

    <div
      class="flex flex-col items-stretch justify-between gap-5 border-t border-line p-[22px] text-left xs:col-span-full xs:flex-row xs:items-center xs:p-7 md:col-auto md:flex-col md:items-end md:border-t-0 md:border-l md:text-right"
    >
      <div>
        <span class="block text-[9px] text-muted">Cena mieszkania</span>

        <strong
          class="my-1 block font-display text-[23px] font-normal text-brand"
        >
          {{ formatPrice(apartment.price) }} zł
        </strong>

        <small class="block text-[9px] text-muted">
          {{ formatPricePerMeter(apartment.price, apartment.area) }} zł/m²
        </small>
      </div>

      <RouterLink
        class="inline-flex min-h-[43px] items-center justify-center gap-3 bg-brand px-4 text-[10px] font-bold text-white transition-colors hover:bg-brand-light xs:justify-start"
        :to="`/mieszkania/${apartment.slug}`"
      >
        Zobacz lokal
        <span aria-hidden="true">→</span>
      </RouterLink>
    </div>
  </article>
</template>

<style scoped>
.apartment-list-item__number {
  background:
    linear-gradient(rgba(23, 63, 53, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(23, 63, 53, 0.05) 1px, transparent 1px), #f2eee5;
  background-size: 22px 22px;
}
</style>
