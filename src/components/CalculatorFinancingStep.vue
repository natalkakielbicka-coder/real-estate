<script setup>
import { formatPrice } from '../utils/apartmentFormatters'
import { toNumberInputValue } from '../utils/numberHelpers'

const props = defineProps({
  apartmentPrice: {
    type: Number,
    default: 0
  },
  ownContribution: {
    type: [Number, String],
    default: 0
  },
  contributionPercent: {
    type: Number,
    default: 0
  },
  neededLoan: {
    type: Number,
    default: 0
  },
  hasLowContribution: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:ownContribution'])

const updateOwnContribution = (event) => {
  const value = toNumberInputValue(event.target.value)

  if (value === '') {
    emit('update:ownContribution', '')
    return
  }

  const limitedValue = Math.min(value, props.apartmentPrice)

  emit('update:ownContribution', limitedValue)
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
        2
      </span>

      <div>
        <h2 class="mb-1 text-[clamp(25px,3vw,32px)]">Finansowanie</h2>

        <p class="mb-0 text-sm text-muted">
          Określ wysokość wkładu własnego, aby zobaczyć szacowaną kwotę kredytu.
        </p>
      </div>
    </div>

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
          class="min-h-[54px] w-full rounded-[6px] border border-line bg-panel py-3 pr-16 pl-4 font-semibold text-[var(--color-text)] outline-none transition-colors hover:border-gold focus:border-brand"
          type="number"
          min="0"
          :max="apartmentPrice"
          step="1000"
          :value="ownContribution"
          @input="updateOwnContribution"
        />

        <span
          class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm font-semibold text-muted"
        >
          zł
        </span>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between gap-4 text-sm">
      <p class="mb-0 text-muted">
        Wpisana kwota:

        <strong class="text-brand">
          {{ formatPrice(ownContribution) }} zł
        </strong>
      </p>

      <div
        class="grid min-h-11 min-w-[78px] place-items-center rounded-[6px] border border-line bg-page px-4 font-display text-xl text-brand"
      >
        {{ contributionPercent }}%
      </div>
    </div>

    <div class="mt-4 h-2 overflow-hidden rounded-full bg-line">
      <div
        class="h-full rounded-full bg-brand transition-[width] duration-300"
        :style="{ width: `${contributionPercent}%` }"
      ></div>
    </div>

    <p
      v-if="hasLowContribution"
      class="mt-5 mb-0 border-l-2 border-gold bg-[rgba(199,157,98,0.1)] px-4 py-3 text-sm text-muted"
    >
      Wkład własny wynosi mniej niż 20% ceny mieszkania.
    </p>

    <div class="mt-7 grid gap-4 sm:grid-cols-2">
      <div class="rounded-[6px] bg-page p-5">
        <strong class="block font-display text-2xl font-normal text-brand">
          {{ formatPrice(ownContribution) }} zł
        </strong>

        <span class="mt-1 block text-xs text-muted"> wkładu własnego </span>
      </div>

      <div class="rounded-[6px] bg-page p-5">
        <strong class="block font-display text-2xl font-normal text-brand">
          {{ formatPrice(neededLoan) }} zł
        </strong>

        <span class="mt-1 block text-xs text-muted"> potrzebnego kredytu </span>
      </div>
    </div>
  </section>
</template>
