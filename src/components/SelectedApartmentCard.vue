<script setup>
import { computed, ref, watch } from 'vue'
import { getRoomsLabel } from '../utils/apartmentFormatters'
import { getPublicAssetPath } from '../utils/assetPaths'

const props = defineProps({
  apartment: {
    type: Object,
    required: true
  }
})

const investmentImage = computed(() => {
  return getPublicAssetPath(
    `/images/investments/${props.apartment.investmentId}.png`
  )
})

const isImageLoaded = ref(false)

watch(investmentImage, () => {
  isImageLoaded.value = false
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
    <div class="relative min-h-[190px] overflow-hidden sm:min-h-full">
      <div
        v-if="!isImageLoaded"
        class="absolute inset-0 animate-pulse bg-gradient-to-br from-[#eee9df] via-[#f7f4ee] to-[#e5ddcf]"
        aria-hidden="true"
      ></div>

      <img
        class="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
        :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
        :src="investmentImage"
        :alt="`Inwestycja ${apartment.investment}`"
        @load="isImageLoaded = true"
      />
    </div>

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
