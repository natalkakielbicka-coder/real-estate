<script setup>
import { computed } from 'vue'
import PurchaseCostChart from './PurchaseCostChart.vue'
import { formatPrice } from '../utils/apartmentFormatters'

const props = defineProps({
  apartmentPrice: {
    type: Number,
    default: 0
  },
  finishingCost: {
    type: Number,
    default: 0
  },
  additionalCosts: {
    type: Number,
    default: 0
  },
  totalCost: {
    type: Number,
    default: 0
  },
  neededLoan: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['save', 'reset'])

const costRows = computed(() => {
  return [
    {
      label: 'Cena mieszkania',
      value: props.apartmentPrice
    },
    {
      label: 'Wykończenie',
      value: props.finishingCost
    },
    {
      label: 'PCC',
      value: 0,
      description: 'Podatek od czynności cywilnoprawnych'
    },
    {
      label: 'Pozostałe koszty',
      value: props.additionalCosts
    }
  ]
})
</script>

<template>
  <aside
    class="rounded-[14px] border border-line bg-panel p-[clamp(24px,3vw,32px)] shadow-[0_10px_35px_rgba(23,63,53,0.08)] lg:sticky lg:top-[112px]"
  >
    <p
      class="mb-4 text-[10px] font-bold tracking-[0.24em] text-muted uppercase"
    >
      Twój wynik
    </p>

    <strong
      class="block font-display text-[clamp(42px,5vw,62px)] leading-none font-normal text-brand"
    >
      {{ formatPrice(totalCost) }} zł
    </strong>

    <p class="mt-3 mb-0 text-sm text-[var(--color-text)]">
      Całkowity koszt zakupu
    </p>

    <div
      v-if="apartmentPrice"
      class="mt-8"
    >
      <PurchaseCostChart
        :apartment-price="apartmentPrice"
        :finishing-cost="finishingCost"
        :additional-costs="additionalCosts"
        :total-cost="totalCost"
      />
    </div>

    <div class="mt-8 border-t border-line pt-5">
      <dl class="divide-y divide-line">
        <div
          v-for="row in costRows"
          :key="row.label"
          class="flex justify-between gap-5 py-3 text-sm"
        >
          <dt class="flex items-center gap-2 text-[var(--color-text)]">
            {{ row.label }}

            <span
              v-if="row.description"
              class="grid size-4 place-items-center rounded-full border border-muted text-[9px] text-muted"
              :title="row.description"
            >
              i
            </span>
          </dt>

          <dd class="m-0 text-right font-semibold text-[var(--color-text)]">
            {{ formatPrice(row.value) }} zł
          </dd>
        </div>
      </dl>
    </div>

    <div
      class="mt-5 flex items-center justify-between gap-4 rounded-[6px] bg-brand px-5 py-4 text-panel shadow-[0_8px_24px_rgba(23,63,53,0.18)]"
    >
      <span class="text-sm font-semibold"> Potrzebny kredyt </span>

      <strong class="font-display text-2xl font-normal">
        {{ formatPrice(neededLoan) }} zł
      </strong>
    </div>

    <button
      class="group mt-5 flex min-h-[54px] w-full items-center justify-center gap-3 rounded-[6px] bg-gold px-5 text-sm font-semibold text-panel shadow-[0_8px_24px_rgba(199,157,98,0.2)] transition-[background-color,transform,box-shadow] hover:bg-[#b98e52]"
      type="button"
      @click="emit('save')"
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
      @click="emit('reset')"
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
</template>
