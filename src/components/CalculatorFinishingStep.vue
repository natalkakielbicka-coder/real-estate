<script setup>
import { formatPrice } from '../utils/apartmentFormatters'

defineProps({
  standards: {
    type: Array,
    default: () => []
  },
  costPerMeter: {
    type: Number,
    default: 0
  },
  totalCost: {
    type: Number,
    default: 0
  },
  apartmentArea: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:costPerMeter'])

const selectStandard = (price) => {
  emit('update:costPerMeter', price)
}

const updateCostPerMeter = (event) => {
  emit('update:costPerMeter', Number(event.target.value))
}
</script>

<template>
  <section
    class="mt-4 rounded-[14px] border border-line bg-panel p-[clamp(22px,3vw,32px)] shadow-[0_10px_35px_rgba(23,63,53,0.06)]"
  >
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

    <div class="mt-8 grid gap-4 sm:grid-cols-3">
      <button
        v-for="standard in standards"
        :key="standard.name"
        class="group relative overflow-hidden rounded-[8px] border p-5 text-left transition-[border-color,background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5"
        :class="
          costPerMeter === standard.price
            ? 'border-brand bg-[rgba(23,63,53,0.05)] shadow-[0_8px_24px_rgba(23,63,53,0.08)]'
            : 'border-line bg-panel hover:border-gold'
        "
        type="button"
        @click="selectStandard(standard.price)"
      >
        <span
          v-if="costPerMeter === standard.price"
          class="absolute top-0 right-0 left-0 h-[3px] bg-brand"
          aria-hidden="true"
        ></span>

        <div class="flex items-start justify-between gap-3">
          <span class="block text-sm font-bold text-brand">
            {{ standard.name }}
          </span>

          <span
            v-if="costPerMeter === standard.price"
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
            class="min-h-[54px] w-full rounded-[6px] border border-line bg-panel py-3 pr-20 pl-4 font-semibold text-[var(--color-text)] outline-none transition-colors hover:border-gold focus:border-brand"
            type="number"
            min="0"
            step="100"
            :value="costPerMeter"
            @input="updateCostPerMeter"
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

        <strong class="mt-1 block font-display text-2xl font-normal text-brand">
          {{ formatPrice(totalCost) }} zł
        </strong>
      </div>
    </div>

    <p class="mt-4 mb-0 text-xs text-muted">
      {{ apartmentArea }} m² × {{ formatPrice(costPerMeter) }} zł/m²
    </p>
  </section>
</template>
