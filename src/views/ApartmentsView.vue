<script setup>
import { apartments } from '../data/apartments'
</script>

<template>
  <main class="apartments-page">
    <section class="apartments-header">
      <div class="container">
        <p class="apartments-header__eyebrow">
          Oferta mieszkań
        </p>

        <h1>Znajdź swoje mieszkanie</h1>

        <p class="apartments-header__description">
          Porównaj dostępne lokale i wybierz przestrzeń
          dopasowaną do Twoich potrzeb.
        </p>

        <p class="apartments-header__count">
          Liczba mieszkań: <strong>{{ apartments.length }}</strong>
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.apartments-page {
  min-height: 100vh;
  padding-top: 88px;
}

.apartments-header {
  padding-block: clamp(70px, 10vw, 130px);
  background-color: var(--color-primary);
}

.apartments-header__eyebrow {
  margin-bottom: 20px;
  color: var(--color-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

h1 {
  max-width: 750px;
  margin-bottom: 24px;
  color: var(--color-surface);
  font-family: var(--font-body);
  font-size: clamp(46px, 6vw, 78px);
  font-weight: 600;
  letter-spacing: -0.055em;
}

.apartments-header__description {
  max-width: 570px;
  margin-bottom: 38px;
  color: rgba(255, 255, 255, 0.7);
  font-size: clamp(16px, 2vw, 19px);
}

.apartments-header__count {
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
}

.apartments-header__count strong {
  margin-left: 5px;
  color: var(--color-accent);
  font-size: 18px;
}

@media (max-width: 767px) {
  .apartments-header {
    padding-block: 75px;
  }
}

@media (max-width: 479px) {
  .apartments-header {
    padding-block: 60px;
  }

  h1 {
    font-size: 43px;
  }
}
</style>