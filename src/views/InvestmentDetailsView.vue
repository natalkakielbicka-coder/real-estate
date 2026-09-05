<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { investments } from '../data/investments'

const route = useRoute()

const investment = computed(() => {
  return investments.find((item) => {
    return item.id === route.params.id
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
</style>
