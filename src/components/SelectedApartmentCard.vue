<script setup>
import { computed } from 'vue'
import { getRoomsLabel } from '../utils/apartmentFormatters'

const props = defineProps({
  apartment: {
    type: Object,
    required: true
  }
})

const investmentImage = computed(() => {
  return `/images/investments/${props.apartment.investmentId}.png`
})

const outdoorSpaceLabels = {
  balcony: 'Balkon',
  garden: 'Ogródek',
  terrace: 'Taras',
  loggia: 'Loggia'
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('pl-PL').format(price)
}

const formatFloor = (floor) => {
  if (floor === 0) {
    return 'Parter'
  }

  return `${floor}. piętro`
}
</script>

<template>
  <article
    class="grid overflow-hidden border border-line bg-page sm:grid-cols-[180px_minmax(0,1fr)]"
  >
    <img
      class="h-[190px] w-full object-cover sm:h-full"
      :src="investmentImage"
      :alt="`Inwestycja ${apartment.investment}`"
    />

    <div
      class="grid gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
    >
      <div>
        <h3 class="mb-1 text-2xl">
          {{ apartment.investment }}
        </h3>

        <p class="mb-4 text-sm text-muted">
          Lokal {{ apartment.number }} · {{ apartment.rooms }}
          {{ getRoomsLabel(apartment.rooms) }}
        </p>

        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span> {{ apartment.area }} m² </span>

          <span
            class="text-line"
            aria-hidden="true"
          >
            |
          </span>

          <span>
            {{ formatFloor(apartment.floor) }}
          </span>

          <template v-if="apartment.outdoorSpace">
            <span
              class="text-line"
              aria-hidden="true"
            >
              |
            </span>

            <span>
              {{
                outdoorSpaceLabels[apartment.outdoorSpace.type] ||
                apartment.outdoorSpace.type
              }}
            </span>
          </template>
        </div>
      </div>

      <div class="sm:text-right">
        <strong
          class="block font-display text-[clamp(26px,3vw,34px)] font-normal text-brand"
        >
          {{ formatPrice(apartment.price) }} zł
        </strong>

        <RouterLink
          class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold underline underline-offset-4"
          :to="{
            name: 'apartment-details',
            params: {
              slug: apartment.slug
            }
          }"
        >
          Zobacz szczegóły
          <span aria-hidden="true">→</span>
        </RouterLink>
      </div>
    </div>
  </article>
</template>
