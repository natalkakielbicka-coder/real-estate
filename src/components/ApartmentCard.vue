<script setup>
import {
  apartmentStatusLabels,
  apartmentStatusClasses
} from '../constants/apartmentStatuses'
import { outdoorSpaceLabels } from '../constants/apartmentAttributes'
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
    class="overflow-hidden bg-panel shadow-[0_14px_45px_rgba(23,63,53,0.08)] transition-shadow duration-300 hover:shadow-[0_22px_55px_rgba(23,63,53,0.14)]"
  >
    <div
      class="apartment-card__visual relative grid min-h-[250px] place-items-center overflow-hidden"
    >
      <div
        class="absolute top-[18px] left-[18px] z-[2] px-3 py-[7px] text-[10px] font-bold tracking-[0.08em] text-white uppercase"
        :class="apartmentStatusClasses[apartment.status]"
      >
        {{ apartmentStatusLabels[apartment.status] }}
      </div>

      <button
        class="absolute top-[15px] right-4 z-[2] grid size-[42px] place-items-center rounded-full border-0 bg-white/90 text-[25px] leading-none text-brand transition-[color,transform] duration-200 hover:scale-[1.08] hover:text-[#a94d4d]"
        type="button"
        :aria-label="`Dodaj mieszkanie ${apartment.number} do ulubionych`"
      >
        ♡
      </button>

      <div class="relative z-[1] flex flex-col items-center">
        <span
          class="mb-[5px] text-[11px] font-bold tracking-[0.14em] text-gold uppercase"
        >
          {{ apartment.building }}
        </span>

        <strong
          class="font-display text-[58px] leading-none font-normal text-brand"
        >
          {{ apartment.number }}
        </strong>

        <small class="mt-2.5 text-[11px] font-semibold text-muted">
          {{ getFloorLabel(apartment.floor) }}
        </small>
      </div>

      <div
        v-if="apartment.featured"
        class="absolute right-0 bottom-0 bg-gold px-3.5 py-2 text-[10px] font-bold tracking-[0.08em] text-brand uppercase"
      >
        Polecane
      </div>
    </div>

    <div class="p-[26px] max-xs:px-[18px] max-xs:py-[22px]">
      <div class="mb-2.5 flex justify-between gap-3">
        <span
          class="text-[11px] font-bold tracking-[0.08em] text-gold uppercase"
        >
          {{ apartment.investment }}
        </span>

        <small class="text-right text-[11px] text-muted">
          {{ apartment.city }}, {{ apartment.district }}
        </small>
      </div>

      <h2 class="mb-[22px] text-[29px]">Mieszkanie {{ apartment.number }}</h2>

      <div class="mb-[18px] grid grid-cols-3 border-y border-line py-[17px]">
        <div class="border-r border-line pr-3">
          <strong class="block text-[13px] text-brand">
            {{ apartment.rooms }}
          </strong>

          <span class="mt-[3px] block text-[9px] text-muted uppercase">
            pokoje
          </span>
        </div>

        <div class="border-r border-line px-3 max-xs:px-2">
          <strong class="block text-[13px] text-brand">
            {{ apartment.area }} m²
          </strong>

          <span class="mt-[3px] block text-[9px] text-muted uppercase">
            powierzchnia
          </span>
        </div>

        <div class="pl-3 max-xs:pl-2">
          <strong class="block text-[13px] text-brand">
            {{ getFloorLabel(apartment.floor) }}
          </strong>

          <span class="mt-[3px] block text-[9px] text-muted uppercase">
            kondygnacja
          </span>
        </div>
      </div>

      <div class="mb-[22px] flex justify-between text-xs text-muted">
        <span>
          {{ outdoorSpaceLabels[apartment.outdoorSpace.type] }}
        </span>

        <strong class="text-brand">
          {{ apartment.outdoorSpace.area }} m²
        </strong>
      </div>

      <div
        class="flex items-end justify-between gap-4 max-xs:flex-col max-xs:items-stretch"
      >
        <div>
          <span class="block text-[10px] text-muted"> cena mieszkania </span>

          <strong
            class="my-[2px] block font-display text-2xl font-normal text-brand"
          >
            {{ formatPrice(apartment.price) }} zł
          </strong>

          <small class="block text-[10px] text-muted">
            {{ formatPricePerMeter(apartment.price, apartment.area) }} zł/m²
          </small>
        </div>

        <RouterLink
          class="flex min-h-[45px] items-center gap-3 bg-brand px-[17px] text-[11px] font-bold text-white transition-colors hover:bg-brand-light max-xs:justify-center"
          :to="`/mieszkania/${apartment.slug}`"
        >
          <span>Zobacz lokal</span>
          <span aria-hidden="true">→</span>
        </RouterLink>
      </div>
    </div>
  </article>
</template>

<style scoped>
.apartment-card__visual {
  background:
    linear-gradient(rgba(23, 63, 53, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(23, 63, 53, 0.05) 1px, transparent 1px),
    linear-gradient(135deg, #f2eee5, #e5ddcf);
  background-size:
    24px 24px,
    24px 24px,
    cover;
}

.apartment-card__visual::before {
  position: absolute;
  width: 190px;
  height: 190px;
  content: '';
  border: 1px solid rgba(23, 63, 53, 0.12);
  border-radius: 50%;
}
</style>
