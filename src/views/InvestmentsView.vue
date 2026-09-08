<script setup>
import { investments } from '../data/investments'
import { apartments } from '../data/apartments'
import InvestmentCard from '../components/InvestmentCard.vue'
import { getApartmentsCountByInvestment } from '../utils/investmentHelpers'
</script>

<template>
  <main class="investments-page pt-[88px]">
    <section
      class="investments-page__header text-white bg-brand py-[clamp(70px,9vw,130px)]"
    >
      <div class="container">
        <p
          class="investments-page__eyebrow mb-5 text-[11px] font-bold tracking-[0.16em] text-gold uppercase"
        >
          Nasze realizacje
        </p>

        <h1
          class="mb-[30px] max-w-[850px] text-[clamp(48px,6vw,76px)] text-white"
        >
          Inwestycje stworzone do życia
        </h1>

        <p
          class="investments-page__description mb-0 max-w-[600px] text-[17px] text-[rgba(255,255,255,0.68)]"
        >
          Poznaj nasze aktualne inwestycje i wybierz lokalizację dopasowaną do
          swojego stylu życia.
        </p>
      </div>
    </section>

    <section class="investments-page__content py-[clamp(60px,8vw,110px)]">
      <div
        class="container grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <InvestmentCard
          v-for="investment in investments"
          :key="investment.id"
          :investment="investment"
          :apartments-count="
            getApartmentsCountByInvestment(apartments, investment.id)
          "
        />
      </div>
    </section>
  </main>
</template>
