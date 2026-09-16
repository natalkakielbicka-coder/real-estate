<script setup>
import SelectedApartmentCard from './SelectedApartmentCard.vue'
import { getRoomsLabel } from '../utils/apartmentFormatters'

defineProps({
  calculationMode: {
    type: String,
    default: 'apartment'
  },
  investments: {
    type: Array,
    default: () => []
  },
  apartments: {
    type: Array,
    default: () => []
  },
  selectedInvestment: {
    type: String,
    default: ''
  },
  selectedApartmentId: {
    type: [Number, String],
    default: null
  },
  selectedApartment: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'select-investment',
  'select-apartment',
  'change-mode'
])

const handleInvestmentChange = (event) => {
  emit('select-investment', event.target.value)
}

const handleApartmentChange = (event) => {
  emit('select-apartment', event.target.value)
}
</script>

<template>
  <section
    class="rounded-[14px] border border-line bg-panel p-[clamp(22px,3vw,32px)] shadow-[0_10px_35px_rgba(23,63,53,0.06)]"
  >
    <div class="flex items-start gap-4">
      <span
        class="grid size-11 shrink-0 place-items-center rounded-full bg-page font-display text-xl text-brand"
        aria-hidden="true"
      >
        1
      </span>

      <div>
        <h2 class="mb-1 text-[clamp(25px,3vw,32px)]">Wybierz mieszkanie</h2>

        <p class="mb-0 text-sm text-muted">
          Wybierz mieszkanie z naszej oferty lub wpisz dane ręcznie.
        </p>
      </div>
    </div>

    <div
      class="mt-6 grid overflow-hidden rounded border border-brand/15 sm:grid-cols-2"
    >
      <button
        class="min-h-11 px-5 py-3 text-sm font-semibold transition-colors"
        :class="
          calculationMode === 'apartment'
            ? 'bg-brand text-white'
            : 'bg-panel text-brand hover:bg-brand/5'
        "
        type="button"
        :aria-pressed="calculationMode === 'apartment'"
        @click="emit('change-mode', 'apartment')"
      >
        Z naszej oferty
      </button>

      <button
        class="min-h-11 border-t border-brand/15 px-5 py-3 text-sm font-semibold transition-colors sm:border-t-0 sm:border-l"
        :class="
          calculationMode === 'custom'
            ? 'bg-brand text-white'
            : 'bg-panel text-brand hover:bg-brand/5'
        "
        type="button"
        :aria-pressed="calculationMode === 'custom'"
        @click="emit('change-mode', 'custom')"
      >
        Wpisz dane ręcznie
      </button>
    </div>

    <template v-if="calculationMode === 'apartment'">
      <div class="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label
            for="investment"
            class="mb-2 block text-sm font-semibold text-[var(--color-text)]"
          >
            Inwestycja
          </label>

          <div class="relative">
            <select
              id="investment"
              class="min-h-[54px] w-full appearance-none rounded-[6px] border border-line bg-panel py-3 pr-12 pl-4 text-sm font-semibold text-[var(--color-text)] outline-none transition-colors hover:border-gold focus:border-brand"
              :value="selectedInvestment"
              @change="handleInvestmentChange"
            >
              <option
                v-for="investment in investments"
                :key="investment"
                :value="investment"
              >
                {{ investment }}
              </option>
            </select>

            <svg
              class="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-brand"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        <div>
          <label
            for="apartment"
            class="mb-2 block text-sm font-semibold text-[var(--color-text)]"
          >
            Mieszkanie
          </label>

          <div class="relative">
            <select
              id="apartment"
              class="min-h-[54px] w-full appearance-none rounded-[6px] border border-line bg-panel py-3 pr-12 pl-4 text-sm font-semibold text-[var(--color-text)] outline-none transition-colors hover:border-gold focus:border-brand"
              :value="selectedApartmentId"
              @change="handleApartmentChange"
            >
              <option
                v-for="apartment in apartments"
                :key="apartment.id"
                :value="apartment.id"
              >
                {{ apartment.number }} · {{ apartment.rooms }}
                {{ getRoomsLabel(apartment.rooms) }} · {{ apartment.area }} m²
              </option>
            </select>

            <svg
              class="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-brand"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      <SelectedApartmentCard
        v-if="selectedApartment"
        class="mt-5"
        :apartment="selectedApartment"
      />
    </template>

    <div
      v-else
      class="mt-7 border border-dashed border-line p-5 text-sm text-muted"
    >
      Tutaj pojawią się pola do wpisania ceny i powierzchni mieszkania.
    </div>
  </section>
</template>
