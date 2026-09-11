<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { apartments } from '../data/apartments'
import { floorPlans } from '../data/floorPlans'
import {
  apartmentStatusLabels,
  apartmentStatusClasses
} from '../constants/apartmentStatuses'
import ApartmentGallery from '../components/ApartmentGallery.vue'
import ApartmentGrid from '../components/ApartmentGrid.vue'
import {
  getFloorLabel,
  formatPrice,
  formatPricePerMeter
} from '../utils/apartmentFormatters'
import {
  exposureLabels,
  outdoorSpaceLabels
} from '../constants/apartmentAttributes'
import { formatCompletionDate } from '../utils/dateFormatters'
import { useToast } from '../composables/useToast'

const route = useRoute()
const { showToast } = useToast()

const apartment = computed(() => {
  return apartments.find((item) => {
    return item.slug === route.params.slug
  })
})

const isMobileDevice = () => {
  if (navigator.userAgentData?.mobile !== undefined) {
    return navigator.userAgentData.mobile
  }

  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

const shareApartment = async () => {
  if (!apartment.value) {
    return
  }

  const shareData = {
    title: `Mieszkanie ${apartment.value.number} – ${apartment.value.investment}`,
    text: `Zobacz mieszkanie ${apartment.value.number} w inwestycji ${apartment.value.investment}.`,
    url: window.location.href
  }

  try {
    if (isMobileDevice() && navigator.share) {
      await navigator.share(shareData)
      return
    }

    await navigator.clipboard.writeText(shareData.url)

    showToast('Link do mieszkania został skopiowany', 'success')
  } catch (error) {
    if (error.name === 'AbortError') {
      return
    }

    showToast('Nie udało się udostępnić linku', 'error')
  }
}

const similarApartments = computed(() => {
  if (!apartment.value) {
    return []
  }

  return apartments
    .filter((item) => {
      return (
        item.investmentId === apartment.value.investmentId &&
        item.id !== apartment.value.id
      )
    })
    .slice(0, 3)
})

const hasInteractiveFloorPlan = computed(() => {
  if (!apartment.value) {
    return false
  }

  return floorPlans.some((floorPlan) => {
    return (
      floorPlan.investmentId === apartment.value.investmentId &&
      floorPlan.building === apartment.value.building &&
      Number(floorPlan.floor) === Number(apartment.value.floor) &&
      floorPlan.apartmentAreas.some((area) => {
        return area.apartmentId === apartment.value.id
      })
    )
  })
})
</script>

<template>
  <main class="min-h-screen pt-[140px] pb-20 max-sm:pt-[120px]">
    <div
      v-if="apartment"
      class="container"
    >
      <RouterLink
        class="mb-10 inline-block text-xs font-bold text-muted transition-colors hover:text-brand"
        to="/mieszkania"
      >
        ← Wróć do mieszkań
      </RouterLink>

      <div
        class="grid grid-cols-1 gap-[clamp(50px,7vw,100px)] md:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]"
      >
        <ApartmentGallery
          :key="apartment.id"
          :apartment="apartment"
        />

        <div>
          <p
            class="mb-[18px] text-[11px] font-bold tracking-[0.13em] text-gold uppercase"
          >
            {{ apartment.investment }} · budynek
            {{ apartment.building }}
          </p>

          <span
            class="mb-[18px] inline-flex px-3 py-[7px] text-[9px] font-bold tracking-[0.08em] text-white uppercase"
            :class="apartmentStatusClasses[apartment.status]"
          >
            {{ apartmentStatusLabels[apartment.status] }}
          </span>

          <h1 class="mb-4 text-[clamp(36px,4vw,56px)]">
            Mieszkanie {{ apartment.number }}
          </h1>

          <p class="mb-10 text-muted">
            {{ apartment.address }}, {{ apartment.city }}
          </p>

          <div
            class="grid grid-cols-1 border-t border-l border-line xs:grid-cols-2"
          >
            <div class="min-h-[110px] border-r border-b border-line p-[22px]">
              <span
                class="mb-2 block text-[9px] font-bold text-muted uppercase"
              >
                Powierzchnia
              </span>

              <strong class="block text-xl text-brand">
                {{ apartment.area }} m²
              </strong>
            </div>

            <div class="min-h-[110px] border-r border-b border-line p-[22px]">
              <span
                class="mb-2 block text-[9px] font-bold text-muted uppercase"
              >
                Liczba pokoi
              </span>

              <strong class="block text-xl text-brand">
                {{ apartment.rooms }}
              </strong>
            </div>

            <div class="min-h-[110px] border-r border-b border-line p-[22px]">
              <span
                class="mb-2 block text-[9px] font-bold text-muted uppercase"
              >
                Piętro
              </span>

              <strong class="block text-xl text-brand">
                {{ getFloorLabel(apartment.floor) }}
              </strong>
            </div>

            <div class="min-h-[110px] border-r border-b border-line p-[22px]">
              <span
                class="mb-2 block text-[9px] font-bold text-muted uppercase"
              >
                Cena
              </span>

              <strong class="block text-xl text-brand">
                {{ formatPrice(apartment.price) }} zł
              </strong>
            </div>

            <div class="min-h-[110px] border-r border-b border-line p-[22px]">
              <span
                class="mb-2 block text-[9px] font-bold text-muted uppercase"
              >
                Cena za m²
              </span>

              <strong class="block text-xl text-brand">
                {{ formatPricePerMeter(apartment.price, apartment.area) }}
                zł
              </strong>
            </div>

            <div class="min-h-[110px] border-r border-b border-line p-[22px]">
              <span
                class="mb-2 block text-[9px] font-bold text-muted uppercase"
              >
                Termin oddania
              </span>

              <strong class="block text-xl text-brand">
                {{ formatCompletionDate(apartment.completionDate) }}
              </strong>
            </div>
          </div>

          <div class="mt-[38px] border-t border-line pt-[30px]">
            <h2 class="mb-5 font-copy text-xl font-semibold tracking-[-0.03em]">
              Cechy mieszkania
            </h2>

            <ul
              class="mb-[26px] grid list-none grid-cols-1 gap-x-5 gap-y-3 p-0 xs:grid-cols-2"
            >
              <li
                v-for="feature in apartment.features"
                :key="feature"
                class="flex items-start gap-[9px] text-xs text-muted"
              >
                <span
                  class="grid size-[18px] shrink-0 place-items-center rounded-full bg-brand text-[9px] text-white"
                  aria-hidden="true"
                >
                  ✓
                </span>

                {{ feature }}
              </li>

              <li class="flex items-start gap-[9px] text-xs text-muted">
                <span
                  class="grid size-[18px] shrink-0 place-items-center rounded-full bg-brand text-[9px] text-white"
                  aria-hidden="true"
                >
                  ✓
                </span>

                {{ outdoorSpaceLabels[apartment.outdoorSpace.type] }}
                {{ apartment.outdoorSpace.area }} m²
              </li>

              <li
                v-if="apartment.parkingSpace"
                class="flex items-start gap-[9px] text-xs text-muted"
              >
                <span
                  class="grid size-[18px] shrink-0 place-items-center rounded-full bg-brand text-[9px] text-white"
                  aria-hidden="true"
                >
                  ✓
                </span>

                Miejsce parkingowe
              </li>

              <li
                v-if="apartment.storageRoom"
                class="flex items-start gap-[9px] text-xs text-muted"
              >
                <span
                  class="grid size-[18px] shrink-0 place-items-center rounded-full bg-brand text-[9px] text-white"
                  aria-hidden="true"
                >
                  ✓
                </span>

                Komórka lokatorska
              </li>
            </ul>

            <div
              class="flex items-center justify-between gap-5 bg-panel px-[18px] py-4"
            >
              <span class="text-[10px] font-bold text-muted uppercase">
                Ekspozycja okien
              </span>

              <strong class="text-right text-xs text-brand">
                {{
                  apartment.exposure
                    .map((direction) => exposureLabels[direction])
                    .join(', ')
                }}
              </strong>
            </div>

            <div class="mt-5 flex flex-col gap-3 xs:flex-row">
              <RouterLink
                v-if="apartment.status === 'available'"
                class="group flex min-h-[54px] flex-1 items-center justify-center gap-3 bg-gold px-5 text-center text-sm font-bold text-white transition-colors hover:bg-[#b98e52]"
                :to="{
                  name: 'purchase-calculator',
                  query: {
                    apartment: apartment.slug
                  },
                  hash: '#calculator'
                }"
              >
                Oblicz koszt zakupu

                <span
                  class="text-lg transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </RouterLink>

              <RouterLink
                v-if="hasInteractiveFloorPlan"
                class="group flex min-h-[54px] flex-1 items-center justify-center gap-3 bg-brand px-5 text-center text-sm font-bold text-white transition-colors hover:bg-brand-light"
                :to="{
                  name: 'investment-details',
                  params: {
                    id: apartment.investmentId
                  },
                  query: {
                    floor: apartment.floor,
                    apartment: apartment.slug
                  },
                  hash: '#floor-plan'
                }"
              >
                Pokaż na rzucie piętra

                <span
                  class="text-lg transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </RouterLink>
            </div>

            <button
              class="group mt-3 flex min-h-[50px] w-full items-center justify-center gap-3 border border-line bg-transparent px-5 text-sm font-bold text-brand transition-colors hover:border-brand hover:bg-panel"
              type="button"
              @click="shareApartment"
            >
              Udostępnij mieszkanie
              <span
                class="text-lg transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </button>
          </div>
        </div>
      </div>

      <section
        v-if="similarApartments.length > 0"
        class="mt-[clamp(80px,10vw,140px)] border-t border-line pt-[clamp(50px,7vw,90px)]"
      >
        <div
          class="mb-[35px] flex items-end justify-between gap-[30px] max-sm:flex-col max-sm:items-start"
        >
          <div>
            <p
              class="mb-2.5 text-[10px] font-bold tracking-[0.13em] text-gold uppercase"
            >
              Zobacz również
            </p>

            <h2 class="mb-0 text-[clamp(36px,5vw,56px)]">Podobne mieszkania</h2>
          </div>

          <RouterLink
            class="group inline-flex items-center gap-3.5 border-b border-line pb-1.5 text-[11px] font-bold text-brand"
            to="/mieszkania"
          >
            Zobacz wszystkie

            <span
              class="text-lg transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </RouterLink>
        </div>

        <ApartmentGrid :apartments="similarApartments" />
      </section>
    </div>

    <div
      v-else
      class="container py-[100px] text-center"
    >
      <h1>Nie znaleziono mieszkania</h1>

      <RouterLink
        class="inline-flex bg-brand px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-light"
        to="/mieszkania"
      >
        Wróć do listy
      </RouterLink>
    </div>
  </main>
</template>
