<script setup>
import { formatPrice } from '../utils/apartmentFormatters'
import { toNumberInputValue } from '../utils/numberHelpers'

defineProps({
  includeParkingSpace: {
    type: Boolean,
    default: false
  },
  parkingSpacePrice: {
    type: [Number, String],
    default: 0
  },
  includeStorageRoom: {
    type: Boolean,
    default: false
  },
  storageRoomPrice: {
    type: [Number, String],
    default: 0
  },
  notaryFee: {
    type: [Number, String],
    default: 0
  },
  totalAdditionalCosts: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits([
  'update:includeParkingSpace',
  'update:parkingSpacePrice',
  'update:includeStorageRoom',
  'update:storageRoomPrice',
  'update:notaryFee'
])

const updateParkingSelection = (event) => {
  emit('update:includeParkingSpace', event.target.checked)
}

const updateParkingPrice = (event) => {
  const value = toNumberInputValue(event.target.value)

  emit('update:parkingSpacePrice', value)
}

const updateStorageSelection = (event) => {
  emit('update:includeStorageRoom', event.target.checked)
}

const updateStoragePrice = (event) => {
  const value = toNumberInputValue(event.target.value)

  emit('update:storageRoomPrice', value)
}

const updateNotaryFee = (event) => {
  const value = toNumberInputValue(event.target.value)

  emit('update:notaryFee', value)
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
        4
      </span>

      <div>
        <h2 class="mb-1 text-[clamp(25px,3vw,32px)]">Koszty dodatkowe</h2>

        <p class="mb-0 text-sm text-muted">
          Uwzględnij dodatkowe opłaty związane z zakupem mieszkania.
        </p>
      </div>
    </div>

    <div class="mt-8 divide-y divide-line">
      <div
        class="grid items-center gap-4 py-4 sm:grid-cols-[minmax(0,1fr)_230px]"
      >
        <label
          class="flex cursor-pointer items-center gap-3"
          for="include-parking"
        >
          <input
            id="include-parking"
            class="peer sr-only"
            type="checkbox"
            :checked="includeParkingSpace"
            @change="updateParkingSelection"
          />

          <span
            class="grid size-5 shrink-0 place-items-center rounded-[4px] border border-line bg-panel text-xs text-transparent transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-panel"
            aria-hidden="true"
          >
            ✓
          </span>

          <span class="text-sm font-semibold text-[var(--color-text)]">
            Miejsce parkingowe
          </span>
        </label>

        <div class="relative">
          <input
            id="parking-price"
            class="min-h-[48px] w-full rounded-[6px] border border-line bg-panel py-2 pr-12 pl-4 text-sm font-semibold text-[var(--color-text)] outline-none transition-colors hover:border-gold focus:border-brand disabled:cursor-not-allowed disabled:bg-page disabled:text-muted"
            type="number"
            min="0"
            step="1000"
            :value="parkingSpacePrice"
            :disabled="!includeParkingSpace"
            @input="updateParkingPrice"
          />

          <span
            class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-muted"
          >
            zł
          </span>
        </div>
      </div>

      <div
        class="grid items-center gap-4 py-4 sm:grid-cols-[minmax(0,1fr)_230px]"
      >
        <label
          class="flex cursor-pointer items-center gap-3"
          for="include-storage-room"
        >
          <input
            id="include-storage-room"
            class="peer sr-only"
            type="checkbox"
            :checked="includeStorageRoom"
            @change="updateStorageSelection"
          />

          <span
            class="grid size-5 shrink-0 place-items-center rounded-[4px] border border-line bg-panel text-xs text-transparent transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-panel"
            aria-hidden="true"
          >
            ✓
          </span>

          <span class="text-sm font-semibold text-[var(--color-text)]">
            Komórka lokatorska
          </span>
        </label>

        <div class="relative">
          <input
            id="storage-room-price"
            class="min-h-[48px] w-full rounded-[6px] border border-line bg-panel py-2 pr-12 pl-4 text-sm font-semibold text-[var(--color-text)] outline-none transition-colors hover:border-gold focus:border-brand disabled:cursor-not-allowed disabled:bg-page disabled:text-muted"
            type="number"
            min="0"
            step="1000"
            :value="storageRoomPrice"
            :disabled="!includeStorageRoom"
            @input="updateStoragePrice"
          />

          <span
            class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-muted"
          >
            zł
          </span>
        </div>
      </div>

      <div
        class="grid items-center gap-4 py-4 sm:grid-cols-[minmax(0,1fr)_230px]"
      >
        <label
          for="notary-fee"
          class="text-sm font-semibold text-[var(--color-text)]"
        >
          Notariusz i dokumenty
        </label>

        <div class="relative">
          <input
            id="notary-fee"
            class="min-h-[48px] w-full rounded-[6px] border border-line bg-panel py-2 pr-12 pl-4 text-sm font-semibold text-[var(--color-text)] outline-none transition-colors hover:border-gold focus:border-brand"
            type="number"
            min="0"
            step="100"
            :value="notaryFee"
            @input="updateNotaryFee"
          />

          <span
            class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs font-semibold text-muted"
          >
            zł
          </span>
        </div>
      </div>
    </div>

    <div
      class="mt-5 flex flex-col justify-between gap-3 rounded-[6px] bg-page p-5 sm:flex-row sm:items-center"
    >
      <span class="text-sm font-semibold text-muted">
        Łączne koszty dodatkowe
      </span>

      <strong class="font-display text-2xl font-normal text-brand">
        {{ formatPrice(totalAdditionalCosts) }} zł
      </strong>
    </div>
  </section>
</template>
