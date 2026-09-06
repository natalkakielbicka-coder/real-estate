<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { investments } from '../data/investments'
import { apartments } from '../data/apartments'
import ApartmentGrid from '../components/ApartmentGrid.vue'

const route = useRoute()

const investment = computed(() => {
  return investments.find((item) => {
    return item.id === route.params.id
  })
})

const investmentApartments = computed(() => {
  return apartments.filter((apartment) => {
    return apartment.investmentId === route.params.id
  })
})
</script>

<template>
  <main class="investment-details">
    <section
      v-if="investment"
      class="investment-details__hero"
    >
      <div class="container">
        <RouterLink
          class="investment-details__back"
          to="/inwestycje"
        >
          ← Wszystkie inwestycje
        </RouterLink>

        <p class="investment-details__location">
          {{ investment.city }} · {{ investment.district }}
        </p>

        <h1>{{ investment.name }}</h1>

        <p class="investment-details__address">
          {{ investment.address }}
        </p>
      </div>
    </section>

    <section
      v-else
      class="investment-details__not-found container"
    >
      <h1>Nie znaleziono inwestycji</h1>

      <RouterLink to="/inwestycje"> Wróć do inwestycji </RouterLink>
    </section>

    <section
      v-if="investment"
      class="investment-details__apartments"
    >
      <div class="container">
        <div class="investment-details__apartments-header">
          <div>
            <p>Dostępne lokale</p>
            <h2>Mieszkania w tej inwestycji</h2>
          </div>

          <span>
            {{ investmentApartments.length }}
            ofert
          </span>
        </div>

        <ApartmentGrid :apartments="investmentApartments" />
      </div>
    </section>
  </main>
</template>

<style scoped>
.investment-details {
  padding-top: 88px;
}

.investment-details__hero {
  min-height: 520px;
  padding-block: clamp(70px, 10vw, 140px);
  color: #ffffff;
  background-color: var(--color-primary);
}

.investment-details__back {
  display: inline-block;
  margin-bottom: 70px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 12px;
}

.investment-details__back:hover {
  color: var(--color-accent);
}

.investment-details__location {
  margin-bottom: 16px;
  color: var(--color-accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.investment-details h1 {
  max-width: 850px;
  margin-bottom: 20px;
  color: #ffffff;
  font-size: clamp(52px, 8vw, 96px);
}

.investment-details__address {
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.65);
  font-size: 17px;
}

.investment-details__not-found {
  padding-block: 120px;
}

.investment-details__apartments {
  padding-block: clamp(60px, 8vw, 110px);
}

.investment-details__apartments-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 40px;
  gap: 30px;
}

.investment-details__apartments-header p {
  margin-bottom: 10px;
  color: var(--color-accent);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.investment-details__apartments-header h2 {
  margin-bottom: 0;
  font-size: clamp(34px, 5vw, 52px);
}

.investment-details__apartments-header > span {
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 767px) {
  .investment-details__apartments-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
