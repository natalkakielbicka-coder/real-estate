<script setup>
import { computed, ref } from 'vue'
import ApartmentCard from '../components/ApartmentCard.vue'
import { apartments } from '../data/apartments'

const selectedCities = ref([])

const cities = [...new Set(
  apartments.map((apartment) => apartment.city)
)]

const filteredApartments = computed(() => {
  if (selectedCities.value.length === 0) {
    return apartments
  }

  return apartments.filter((apartment) => {
    return selectedCities.value.includes(apartment.city)
  })
})
</script>

<template>
  <main class="apartments-page">
    <section class="apartments-header">
      <div class="container">
        <p class="apartments-header__eyebrow">
          Oferta mieszkań
        </p>

        <h1>Znajdź swoje mieszkanie</h1>

        <div class="apartments-header__bottom">
          <p>
            Porównaj dostępne lokale i wybierz przestrzeń
            dopasowaną do Twoich potrzeb.
          </p>

          <div class="apartments-header__count">
            <strong>{{ apartments.length }}</strong>
            <span>dostępnych ofert</span>
          </div>
        </div>
      </div>
    </section>

    <section class="apartments-results">
      <div class="apartments-layout container">
        <aside class="filters-sidebar">
          <div class="filters-sidebar__header">
            <p>Filtry mieszkań</p>

            <span>
              {{ filteredApartments.length }} ofert
            </span>
          </div>

          <fieldset class="filter-group">
            <legend>Miasto</legend>

            <label
              v-for="city in cities"
              :key="city"
              class="filter-checkbox"
            >
              <input
                v-model="selectedCities"
                type="checkbox"
                :value="city"
              >

              <span class="filter-checkbox__mark"></span>
              <span>{{ city }}</span>
            </label>
          </fieldset>
        </aside>

        <div class="apartments-grid">
          <ApartmentCard
            v-for="apartment in filteredApartments"
            :key="apartment.id"
            :apartment="apartment"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.apartments-page {
  padding-top: 88px;
}

.apartments-header {
  padding-block: clamp(70px, 9vw, 130px);
  color: #ffffff;
  background-color: var(--color-primary);
}

.apartments-header__eyebrow {
  margin-bottom: 20px;
  color: var(--color-accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.apartments-header h1 {
  max-width: 780px;
  margin-bottom: 40px;
  color: #ffffff;
  font-size: clamp(48pxreti,bal, 6vw, 76px);
}

.apartments-header__bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
}

.apartments-header__bottom p {
  max-width: 580px;
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: 17px;
}

.apartments-header__count {
  display: flex;
  align-items: center;
  gap: 13px;
}

.apartments-header__count strong {
  color: var(--color-accent);
  font-family: var(--font-heading);
  font-size: 46px;
  font-weight: 400;
  line-height: 1;
}

.apartments-header__count span {
  max-width: 75px;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.apartments-results {
  padding-block: clamp(60px, 8vw, 110px);
}

.apartments-layout {
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
  align-items: start;
  gap: 32px;
}

.filters-sidebar {
  position: sticky;
  top: 118px;
  min-height: 400px;
  padding: 28px;
  background-color: var(--color-surface);
  box-shadow: 0 14px 45px rgba(23, 63, 53, 0.08);
}

.filters-sidebar p {
  margin-bottom: 0;
  color: var(--color-primary);
  font-size: 18px;
  font-weight: 700;
}

.filters-sidebar__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 15px;
}

.filters-sidebar__header p {
  margin-bottom: 0;
}

.filters-sidebar__header span {
  flex-shrink: 0;
  padding: 5px 8px;
  color: var(--color-primary);
  background-color: var(--color-background);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
}

.filter-group {
  margin: 0;
  padding: 22px 0 0;
  border: 0;
  border-top: 1px solid var(--color-border);
}

.filter-group legend {
  margin-bottom: 16px;
  padding: 0;
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.filter-checkbox {
  position: relative;
  display: flex;
  align-items: center;
  width: fit-content;
  margin-bottom: 12px;
  gap: 10px;
  color: var(--color-text-muted);
  font-size: 12px;
  cursor: pointer;
}

.filter-checkbox:last-child {
  margin-bottom: 0;
}

.filter-checkbox input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.filter-checkbox__mark {
  position: relative;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border: 1px solid #c7cbc8;
  border-radius: 3px;
}

.filter-checkbox input:checked + .filter-checkbox__mark {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.filter-checkbox input:checked + .filter-checkbox__mark::after {
  position: absolute;
  top: 2px;
  left: 5px;
  width: 5px;
  height: 9px;
  content: "";
  border-right: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  transform: rotate(45deg);
}

.apartments-grid {
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

@media (max-width: 1199px) {
  .apartments-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 991px) {
  .apartments-layout {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: static;
    min-height: 150px;
  }
}

@media (max-width: 767px) {
  .apartments-header__bottom {
    align-items: flex-start;
    flex-direction: column;
  }

  .apartments-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 479px) {
  .apartments-layout {
    gap: 24px;
  }

  .filters-sidebar {
    padding: 22px 18px;
  }
}
</style>