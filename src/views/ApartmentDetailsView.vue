<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { apartments } from '../data/apartments'

const route = useRoute()

const apartment = computed(() => {
  return apartments.find((item) => {
    return item.slug === route.params.slug
  })
})

const formattedPrice = computed(() => {
  if (!apartment.value) {
    return ''
  }

  return new Intl.NumberFormat('pl-PL').format(apartment.value.price)
})
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
        <div class="apartment-details__visual">
          <svg>
            <rect
              x="60"
              y="60"
              width="480"
              height="360"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
            />

            <path
              d="M220 60V250H60M220 250H390V420M390 250H540"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
            />

            <path
              d="M285 60V150M390 330H480V420"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
            />
          </svg>

          <span>Przykładowy rzut mieszkania</span>
        </div>

        <div class="apartment-details__content">
          <p class="apartment-details__eyebrow">
            {{ apartment.investment }} · budynek {{ apartment.building }}
          </p>

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
        </div>
      </div>
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

.apartment-details__visual {
  display: flex;
  align-items: center;
  min-height: 580px;
  padding: 60px;
  flex-direction: column;
  justify-content: center;
  color: rgba(23, 63, 53, 0.38);
  background-color: var(--color-surface);
}

.apartment-details__visual svg {
  width: 100%;
  max-width: 580px;
}

.apartment-details__visual span {
  margin-top: 24px;
  color: var(--color-text-muted);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
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
}
</style>
