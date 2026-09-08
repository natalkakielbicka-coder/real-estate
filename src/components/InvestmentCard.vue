<script setup>
import { formatCompletionDate } from '../utils/dateFormatters'
import { getApartmentsLabel } from '../utils/apartmentFormatters'

defineProps({
  investment: {
    type: Object,
    required: true
  },
  apartmentsCount: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <RouterLink
    class="investment-card group grid min-h-[360px] grid-rows-[250px_1fr] bg-brand text-white no-underline transition-shadow duration-300 hover:shadow-[0_24px_55px_rgba(23,63,53,0.2)] max-xs:min-h-[320px] max-xs:grid-rows-[210px_1fr]"
    :to="`/inwestycje/${investment.id}`"
  >
    <div class="investment-card__image relative overflow-hidden">
      <img
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-[600ms] group-hover:scale-105"
        :src="investment.image"
        :alt="`Wizualizacja inwestycji ${investment.name}`"
      />

      <div
        class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(23,63,53,0.55)_100%)]"
        aria-hidden="true"
      ></div>

      <span
        class="absolute right-[18px] bottom-[18px] z-[1] bg-gold px-[11px] py-2 text-[9px] font-bold tracking-[0.08em] text-brand uppercase"
      >
        {{ investment.city }}
      </span>
    </div>

    <div class="investment-card__content p-[30px] max-xs:px-5 max-xs:py-6">
      <p
        class="investment-card__location mb-3 text-[10px] font-bold tracking-[0.12em] text-gold uppercase"
      >
        {{ investment.city }} · {{ investment.district }}
      </p>

      <h2 class="mb-2.5 text-[clamp(28px,3vw,38px)] text-white">
        {{ investment.name }}
      </h2>

      <p
        class="investment-card__address mb-7 text-sm text-[rgba(255,255,255,0.65)]"
      >
        {{ investment.address }}
      </p>

      <div class="investment-card__apartments mb-7 flex items-baseline gap-2">
        <strong
          class="font-display text-[38px] leading-none font-normal text-gold"
        >
          {{ apartmentsCount }}
        </strong>

        <span
          class="text-[10px] font-bold tracking-[0.08em] text-[rgba(255,255,255,0.65)] uppercase"
        >
          {{ getApartmentsLabel(apartmentsCount) }}
        </span>
      </div>

      <div
        class="investment-card__footer flex items-end justify-between gap-5 border-t border-white/15 pt-[18px]"
      >
        <span
          class="max-w-[110px] text-[9px] leading-[1.4] tracking-[0.08em] text-white/55 uppercase"
        >
          Planowane zakończenie
        </span>

        <strong class="font-display text-[19px] font-normal text-white">
          {{ formatCompletionDate(investment.completionDate) }}
        </strong>
      </div>
    </div>
  </RouterLink>
</template>
