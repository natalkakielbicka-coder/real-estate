<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { apartments } from '../data/apartments'
import { apartmentStatusLabels } from '../constants/apartmentStatuses'
import ApartmentGallery from '../components/ApartmentGallery.vue'
import ApartmentGrid from '../components/ApartmentGrid.vue'

const route = useRoute()

const apartment = computed(() => {
  return apartments.find((item) => {
    return item.slug === route.params.slug
  })
})

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

const formattedPrice = computed(() => {
  if (!apartment.value) {
    return ''
  }

  return new Intl.NumberFormat('pl-PL').format(apartment.value.price)
})

const outdoorSpaceLabels = {
  balcony: 'Balkon',
  terrace: 'Taras',
  garden: 'Ogródek',
  loggia: 'Loggia'
}

const exposureLabels = {
  north: 'Północ',
  south: 'Południe',
  east: 'Wschód',
  west: 'Zachód'
}
</script>

<template>
  <main class="apartment-details">
    <div
      v-if="apartment"
      class="container"
    >
      <RouterLink
        class="apartment-details__back"
        to="/mieszkania"
      >
        ← Wróć do mieszkań
      </RouterLink>

      <div class="apartment-details__layout">
        <ApartmentGallery :apartment="apartment" />

        <div class="apartment-details__content">
          <p class="apartment-details__eyebrow">
            {{ apartment.investment }} · budynek {{ apartment.building }}
          </p>

          <span
            class="apartment-details__status"
            :class="`apartment-details__status--${apartment.status}`"
          >
            {{ apartmentStatusLabels[apartment.status] }}
          </span>

          <h1>Mieszkanie {{ apartment.number }}</h1>

          <p class="apartment-details__address">
            {{ apartment.address }}, {{ apartment.city }}
          </p>

          <div class="apartment-details__parameters">
            <div>
              <span>Powierzchnia</span>
              <strong>{{ apartment.area }} m²</strong>
            </div>

            <div>
              <span>Liczba pokoi</span>
              <strong>{{ apartment.rooms }}</strong>
            </div>

            <div>
              <span>Piętro</span>
              <strong>
                {{ apartment.floor === 0 ? 'Parter' : apartment.floor }}
              </strong>
            </div>

            <div>
              <span>Cena</span>
              <strong>{{ formattedPrice }} zł</strong>
            </div>
          </div>

          <div class="apartment-details__features">
            <h2>Cechy mieszkania</h2>

            <ul>
              <li
                v-for="feature in apartment.features"
                :key="feature"
              >
                <span aria-hidden="true">✓</span>
                {{ feature }}
              </li>

              <li>
                <span aria-hidden="true">✓</span>

                {{ outdoorSpaceLabels[apartment.outdoorSpace.type] }}
                {{ apartment.outdoorSpace.area }} m²
              </li>

              <li v-if="apartment.parkingSpace">
                <span aria-hidden="true">✓</span>
                Miejsce parkingowe
              </li>

              <li v-if="apartment.storageRoom">
                <span aria-hidden="true">✓</span>
                Komórka lokatorska
              </li>
            </ul>

            <div class="apartment-details__exposure">
              <span>Ekspozycja okien</span>

              <strong>
                {{
                  apartment.exposure
                    .map((direction) => exposureLabels[direction])
                    .join(', ')
                }}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <section
        v-if="similarApartments.length > 0"
        class="similar-apartments"
      >
        <div class="similar-apartments__header">
          <div>
            <p class="similar-apartments__eyebrow">Zobacz również</p>

            <h2>Podobne mieszkania</h2>
          </div>

          <RouterLink to="/mieszkania">
            Zobacz wszystkie
            <span aria-hidden="true">→</span>
          </RouterLink>
        </div>

        <ApartmentGrid :apartments="similarApartments" />
      </section>
    </div>

    <div
      v-else
      class="apartment-details__missing container"
    >
      <h1>Nie znaleziono mieszkania</h1>
      <RouterLink to="/mieszkania"> Wróć do listy </RouterLink>
    </div>
  </main>
</template>

<style scoped>
.apartment-details {
  min-height: 100vh;
  padding-top: 140px;
  padding-bottom: 80px;
}

.apartment-details__back {
  display: inline-block;
  margin-bottom: 40px;
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 700;
}

.apartment-details__back:hover {
  color: var(--color-primary);
}

.apartment-details__layout {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(360px, 0.85fr);
  align-items: center;
  gap: clamp(50px, 7vw, 100px);
}

.apartment-details__eyebrow {
  margin-bottom: 18px;
  color: var(--color-accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.apartment-details h1 {
  margin-bottom: 16px;
  font-size: clamp(48px, 6vw, 76px);
}

.apartment-details__address {
  margin-bottom: 40px;
  color: var(--color-text-muted);
}

.apartment-details__parameters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid var(--color-border);
  border-left: 1px solid var(--color-border);
}

.apartment-details__parameters div {
  min-height: 110px;
  padding: 22px;
  border-right: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.apartment-details__parameters span,
.apartment-details__parameters strong {
  display: block;
}

.apartment-details__parameters span {
  margin-bottom: 8px;
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
}

.apartment-details__parameters strong {
  color: var(--color-primary);
  font-size: 20px;
}

.apartment-details__missing {
  padding-block: 100px;
  text-align: center;
}

.apartment-details__status {
  display: inline-flex;
  margin-bottom: 18px;
  padding: 7px 12px;
  color: #ffffff;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.apartment-details__status--available {
  background-color: #3d806d;
}

.apartment-details__status--reserved {
  background-color: #c28b3f;
}

.apartment-details__status--sold {
  background-color: #929896;
}

.apartment-details__features {
  margin-top: 38px;
  padding-top: 30px;
  border-top: 1px solid var(--color-border);
}

.apartment-details__features h2 {
  margin-bottom: 20px;
  font-family: var(--font-body);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.apartment-details__features ul {
  display: grid;
  margin: 0 0 26px;
  padding: 0;
  grid-template-columns: 1fr 1fr;
  gap: 12px 20px;
  list-style: none;
}

.apartment-details__features li {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  color: var(--color-text-muted);
  font-size: 12px;
}

.apartment-details__features li > span {
  display: grid;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  place-items: center;
  color: #ffffff;
  background-color: var(--color-primary);
  font-size: 9px;
  border-radius: 50%;
}

.apartment-details__exposure {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  gap: 20px;
  background-color: var(--color-surface);
}

.apartment-details__exposure span {
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.apartment-details__exposure strong {
  color: var(--color-primary);
  font-size: 12px;
  text-align: right;
}

.similar-apartments {
  margin-top: clamp(80px, 10vw, 140px);
  padding-top: clamp(50px, 7vw, 90px);
  border-top: 1px solid var(--color-border);
}

.similar-apartments__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 35px;
  gap: 30px;
}

.similar-apartments__eyebrow {
  margin-bottom: 10px;
  color: var(--color-accent);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.similar-apartments h2 {
  margin-bottom: 0;
  font-size: clamp(36px, 5vw, 56px);
}

.similar-apartments__header > a {
  display: inline-flex;
  align-items: center;
  padding-bottom: 6px;
  gap: 14px;
  color: var(--color-primary);
  border-bottom: 1px solid var(--color-border);
  font-size: 11px;
  font-weight: 700;
}

.similar-apartments__header > a span {
  font-size: 18px;
  transition: transform 0.2s ease;
}

.similar-apartments__header > a:hover span {
  transform: translateX(4px);
}

@media (max-width: 991px) {
  .apartment-details__layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .apartment-details {
    padding-top: 120px;
  }

  .apartment-details__visual {
    min-height: 420px;
    padding: 30px;
  }
}

@media (max-width: 479px) {
  .apartment-details__parameters {
    grid-template-columns: 1fr;
  }

  .apartment-details__features ul {
    grid-template-columns: 1fr;
  }
}
</style>
