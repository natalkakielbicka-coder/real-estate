<script setup>
import { investments } from '../data/investments'
import { apartments } from '../data/apartments'
import InvestmentCard from '../components/InvestmentCard.vue'

const getApartmentsCount = (investmentId) => {
  return apartments.filter((apartment) => {
    return apartment.investmentId === investmentId
  }).length
}
</script>

<template>
  <main class="investments-page">
    <section class="investments-page__header">
      <div class="container">
        <p class="investments-page__eyebrow">Nasze realizacje</p>

        <h1>Inwestycje stworzone do życia</h1>

        <p class="investments-page__description">
          Poznaj nasze aktualne inwestycje i wybierz lokalizację dopasowaną do
          swojego stylu życia.
        </p>
      </div>
    </section>

    <section class="investments-page__content">
      <div class="investments-grid container">
        <InvestmentCard
          v-for="investment in investments"
          :key="investment.id"
          :investment="investment"
          :apartments-count="getApartmentsCount(investment.id)"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.investments-page {
  padding-top: 88px;
}

.investments-page__header {
  padding-block: clamp(70px, 9vw, 130px);
  color: #ffffff;
  background-color: var(--color-primary);
}

.investments-page__eyebrow {
  margin-bottom: 20px;
  color: var(--color-accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.investments-page__header h1 {
  max-width: 850px;
  margin-bottom: 30px;
  color: #ffffff;
  font-size: clamp(48px, 6vw, 76px);
}

.investments-page__description {
  max-width: 600px;
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: 17px;
}

.investments-page__content {
  padding-block: clamp(60px, 8vw, 110px);
}

.investments-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

@media (max-width: 991px) {
  .investments-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .investments-grid {
    grid-template-columns: 1fr;
  }
}
</style>
