<script setup>
import { ref, computed } from 'vue'
import { formatPrice } from '../utils/apartmentFormatters'

const props = defineProps({
  currentPrice: {
    type: Number,
    required: true
  },
  priceHistory: {
    type: Array,
    default: () => []
  }
})

const isOpen = ref(false)

const sortedPriceHistory = computed(() => {
  return [...props.priceHistory].sort((firstEntry, secondEntry) => {
    return new Date(secondEntry.date) - new Date(firstEntry.date)
  })
})

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

const formatHistoryDate = (date) => {
  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date))
}
</script>

<template>
  <button
    class="min-h-[110px] border-r border-b border-line bg-transparent p-[22px] text-left transition-colors hover:bg-panel"
    type="button"
    :disabled="props.priceHistory.length === 0"
    @click="openModal"
  >
    <span class="mb-2 block text-[9px] font-bold text-muted uppercase">
      Historia ceny
    </span>

    <strong class="block text-xl text-brand">
      {{ formatPrice(props.currentPrice) }} zł
    </strong>

    <span
      v-if="props.priceHistory.length > 0"
      class="mt-2 block text-[10px] font-semibold text-gold"
    >
      Zobacz zmiany →
    </span>
  </button>

  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[200] flex items-center justify-center bg-black/55 p-4"
      role="presentation"
      @click.self="closeModal"
    >
      <section
        class="relative max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-[14px] bg-panel p-[clamp(22px,4vw,36px)] shadow-[0_24px_80px_rgba(0,0,0,0.25)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="price-history-title"
      >
        <button
          class="absolute top-4 right-4 grid size-10 place-items-center rounded-full border border-line bg-panel text-xl text-brand transition-colors hover:border-brand"
          type="button"
          aria-label="Zamknij historię ceny"
          @click="closeModal"
        >
          ×
        </button>

        <p
          class="mb-2 text-[10px] font-bold tracking-[0.13em] text-gold uppercase"
        >
          Zmiany w czasie
        </p>

        <h2
          id="price-history-title"
          class="mb-6 pr-12 text-[clamp(28px,4vw,38px)]"
        >
          Historia ceny
        </h2>

        <div class="overflow-hidden rounded-[6px] border border-line">
          <div class="max-h-[320px] overflow-y-auto">
            <table class="w-full border-collapse">
              <thead class="sticky top-0 z-10 bg-page">
                <tr>
                  <th
                    class="px-4 py-3 text-left text-[10px] font-bold tracking-[0.08em] text-muted uppercase"
                    scope="col"
                  >
                    Data
                  </th>

                  <th
                    class="px-4 py-3 text-right text-[10px] font-bold tracking-[0.08em] text-muted uppercase"
                    scope="col"
                  >
                    Cena
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-line">
                <tr
                  v-for="entry in sortedPriceHistory"
                  :key="entry.date"
                >
                  <td class="px-4 py-4 text-sm text-muted">
                    {{ formatHistoryDate(entry.date) }}
                  </td>

                  <td class="px-4 py-4 text-right font-semibold text-brand">
                    {{ formatPrice(entry.price) }} zł
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p class="mt-5 mb-0 text-xs leading-relaxed text-muted">
          Najnowsza pozycja przedstawia aktualną cenę mieszkania.
        </p>
      </section>
    </div>
  </Teleport>
</template>
