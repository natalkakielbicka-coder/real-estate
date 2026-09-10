<script setup>
import { ref } from 'vue'
import { apartments } from '../data/apartments'

const formatPrice = (price) => {
  const formattedPrice = new Intl.NumberFormat('pl-PL').format(price)

  return formattedPrice
}

const availableApartments = apartments.filter((apartment) => {
  return apartment.status === 'available'
})

const firstAvailableApartment = availableApartments[0]
const selectedApartmentId = ref(firstAvailableApartment.id)
</script>

<template>
  <main class="min-h-screen bg-page pt-[74px] sm:pt-[88px]">
    <section class="bg-brand py-[clamp(48px,7vw,88px)]">
      <div class="container">
        <p class="mb-4 text-xs font-bold tracking-[0.18em] text-gold uppercase">
          Zaplanuj swój budżet
        </p>

        <h1 class="max-w-[760px] text-[clamp(40px,6vw,76px)] text-panel">
          Kalkulator kosztów zakupu
        </h1>

        <p class="mt-5 max-w-[620px] text-base text-white/70">
          Sprawdź pełny koszt zakupu mieszkania, wysokość dodatkowych opłat oraz
          potrzebnego finansowania.
        </p>
      </div>
    </section>

    <section class="py-[clamp(48px,7vw,88px)]">
      <div
        class="container grid items-start gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]"
      >
        <div class="bg-panel p-[clamp(24px,4vw,48px)]">
          <p
            class="mb-3 text-xs font-bold tracking-[0.16em] text-gold uppercase"
          >
            Krok 01
          </p>

          <h2 class="text-[clamp(30px,4vw,46px)]">Wybierz mieszkanie</h2>

          <p class="mb-8 text-muted">
            Wybierz lokal z aktualnie dostępnych mieszkań.
          </p>

          <p>
            Liczba dostępnych mieszkań:
            <strong>{{ availableApartments.length }}</strong>
          </p>

          <div>
            <label for="apartment"> Wybierz mieszkanie </label>

            <select
              id="apartment"
              v-model="selectedApartmentId"
            >
              <option
                v-for="apartment in availableApartments"
                :key="apartment.id"
                :value="apartment.id"
              >
                {{ apartment.investment }} — lokal {{ apartment.number }} —
                {{ formatPrice(apartment.price) }} zł
              </option>
            </select>
          </div>
        </div>

        <aside
          class="bg-brand p-[clamp(24px,4vw,48px)] text-panel lg:sticky lg:top-[112px]"
        >
          <p
            class="mb-3 text-xs font-bold tracking-[0.16em] text-gold uppercase"
          >
            Podsumowanie
          </p>

          <h2 class="text-[clamp(30px,4vw,46px)] text-panel">Twój budżet</h2>

          <p class="mb-0 text-white/70">
            Wyniki pojawią się po uzupełnieniu kalkulatora.
          </p>
        </aside>
      </div>
    </section>
  </main>
</template>
