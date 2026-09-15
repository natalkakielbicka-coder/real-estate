<script setup>
import { computed } from 'vue'
import { apartments } from '../data/apartments'
import { useFavorites } from '../composables/useFavorites'
import ApartmentGrid from '../components/ApartmentGrid.vue'

const { favoriteApartmentIds } = useFavorites()

const favoriteApartments = computed(() => {
  return apartments.filter((apartment) => {
    return favoriteApartmentIds.value.includes(apartment.id)
  })
})
</script>

<template>
  <main class="min-h-screen pt-[140px] pb-20 max-sm:pt-[120px]">
    <div class="container">
      <div class="mb-[50px] max-w-[720px]">
        <p
          class="mb-4 text-[11px] font-bold tracking-[0.13em] text-gold uppercase"
        >
          Twoja lista
        </p>

        <h1 class="mb-5 text-[clamp(38px,5vw,64px)]">Ulubione mieszkania</h1>

        <p class="max-w-[620px] text-sm leading-relaxed text-muted">
          Tutaj znajdziesz zapisane mieszkania, do których możesz wrócić w
          dowolnym momencie.
        </p>
      </div>

      <ApartmentGrid
        v-if="favoriteApartments.length"
        :apartments="favoriteApartments"
      />

      <div
        v-else
        class="border border-line bg-panel px-6 py-[70px] text-center shadow-[0_14px_45px_rgba(23,63,53,0.06)]"
      >
        <span
          class="mb-5 block font-display text-[56px] leading-none text-gold"
          aria-hidden="true"
        >
          ♡
        </span>

        <h2 class="mb-3 text-[30px]">Nie masz jeszcze ulubionych mieszkań</h2>

        <p class="mx-auto mb-7 max-w-[480px] text-sm text-muted">
          Kliknij serce przy wybranym mieszkaniu, aby zapisać je na tej liście.
        </p>

        <RouterLink
          class="inline-flex min-h-[48px] items-center justify-center gap-3 bg-brand px-6 text-xs font-bold text-white transition-colors hover:bg-brand-light"
          to="/mieszkania"
        >
          Zobacz mieszkania
          <span aria-hidden="true">→</span>
        </RouterLink>
      </div>
    </div>
  </main>
</template>
