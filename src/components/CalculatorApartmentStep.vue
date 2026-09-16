<script setup>
import SelectedApartmentCard from './SelectedApartmentCard.vue'
import { getRoomsLabel } from '../utils/apartmentFormatters'

defineProps({
  calculationMode: {
    type: String,
    default: 'apartment'
  },
  customApartmentPrice: {
    type: Number,
    default: 0
  },
  customApartmentArea: {
    type: Number,
    default: 0
  },
  customMarketType: {
    type: String,
    default: 'primary'
  },
  isFirstHomePurchase: {
    type: Boolean,
    default: false
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
  'change-mode',
  'update-custom-price',
  'update-custom-area',
  'update-custom-market-type',
  'update-first-home-purchase'
])

const handleInvestmentChange = (event) => {
  emit('select-investment', event.target.value)
}

const handleApartmentChange = (event) => {
  emit('select-apartment', event.target.value)
}

const handleCustomPriceInput = (event) => {
  emit('update-custom-price', Number(event.target.value))
}

const handleCustomAreaInput = (event) => {
  emit('update-custom-area', Number(event.target.value))
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
      class="mt-7 grid gap-5 sm:grid-cols-2"
    >
      <div>
        <label
          for="custom-apartment-price"
          class="mb-2 block text-sm font-semibold text-[var(--color-text)]"
        >
          Cena mieszkania
        </label>

        <div class="relative">
          <input
            id="custom-apartment-price"
            class="min-h-[54px] w-full rounded-[6px] border border-line bg-panel py-3 pr-14 pl-4 text-sm font-semibold text-[var(--color-text)] outline-none transition-colors hover:border-gold focus:border-brand"
            type="number"
            min="0"
            step="1000"
            :value="customApartmentPrice"
            :aria-invalid="customApartmentPrice <= 0"
            aria-describedby="custom-apartment-price-error"
            @input="handleCustomPriceInput"
          />

          <span
            class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-muted"
          >
            zł
          </span>
        </div>

        <p
          v-if="customApartmentPrice <= 0"
          id="custom-apartment-price-error"
          class="mt-2 text-xs text-[#a94d4d]"
        >
          Wpisz cenę mieszkania większą od 0 zł.
        </p>
      </div>

      <div>
        <label
          for="custom-apartment-area"
          class="mb-2 block text-sm font-semibold text-[var(--color-text)]"
        >
          Powierzchnia mieszkania
        </label>

        <div class="relative">
          <input
            id="custom-apartment-area"
            class="min-h-[54px] w-full rounded-[6px] border border-line bg-panel py-3 pr-14 pl-4 text-sm font-semibold text-[var(--color-text)] outline-none transition-colors hover:border-gold focus:border-brand"
            type="number"
            min="0"
            step="0.1"
            :value="customApartmentArea"
            :aria-invalid="customApartmentArea <= 0"
            aria-describedby="custom-apartment-area-error"
            @input="handleCustomAreaInput"
          />

          <span
            class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-muted"
          >
            m²
          </span>
        </div>

        <p
          v-if="customApartmentArea <= 0"
          id="custom-apartment-area-error"
          class="mt-2 text-xs text-[#a94d4d]"
        >
          Wpisz powierzchnię większą od 0 m².
        </p>
      </div>

      <fieldset class="sm:col-span-2">
        <legend class="mb-2 text-sm font-semibold text-[var(--color-text)]">
          Rynek
        </legend>

        <div
          class="grid overflow-hidden rounded-[6px] border border-line sm:grid-cols-2"
        >
          <button
            class="min-h-[48px] px-4 py-3 text-sm font-semibold transition-colors"
            :class="
              customMarketType === 'primary'
                ? 'bg-brand text-white'
                : 'bg-panel text-brand hover:bg-brand/5'
            "
            type="button"
            :aria-pressed="customMarketType === 'primary'"
            @click="emit('update-custom-market-type', 'primary')"
          >
            Rynek pierwotny
          </button>

          <button
            class="min-h-[48px] border-t border-line px-4 py-3 text-sm font-semibold transition-colors sm:border-t-0 sm:border-l"
            :class="
              customMarketType === 'secondary'
                ? 'bg-brand text-white'
                : 'bg-panel text-brand hover:bg-brand/5'
            "
            type="button"
            :aria-pressed="customMarketType === 'secondary'"
            @click="emit('update-custom-market-type', 'secondary')"
          >
            Rynek wtórny
          </button>
        </div>
      </fieldset>

      <label
        v-if="customMarketType === 'secondary'"
        class="flex cursor-pointer items-start gap-3 border-t border-line pt-5 sm:col-span-2"
      >
        <input
          class="mt-0.5 size-5 shrink-0 accent-brand"
          type="checkbox"
          :checked="isFirstHomePurchase"
          @change="emit('update-first-home-purchase', $event.target.checked)"
        />

        <span>
          <strong class="block text-sm text-[var(--color-text)]">
            Spełniam warunki zwolnienia z PCC przy zakupie pierwszego mieszkania
          </strong>

          <span class="mt-1 block text-xs leading-relaxed text-muted">
            Zaznacz tylko wtedy, gdy wcześniej nie posiadałaś lub nie posiadałeś
            mieszkania ani domu, z uwzględnieniem wyjątków przewidzianych w
            przepisach.
          </span>
        </span>
      </label>
    </div>
  </section>
</template>
