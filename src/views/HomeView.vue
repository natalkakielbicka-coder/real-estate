<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { apartments } from '../data/apartments'
import { investments } from '../data/investments'
import InvestmentCard from '../components/InvestmentCard.vue'
import ApartmentGrid from '../components/ApartmentGrid.vue'

const router = useRouter()

const selectedCity = ref('')
const selectedRooms = ref('')
const selectedMaxPrice = ref('')

const searchApartments = () => {
  router.push({
    name: 'apartments',
    query: {
      city: selectedCity.value || undefined,
      rooms: selectedRooms.value || undefined,
      maxPrice: selectedMaxPrice.value || undefined
    }
  })
}

const cities = [...new Set(apartments.map((apartment) => apartment.city))]

const roomOptions = [
  ...new Set(apartments.map((apartment) => apartment.rooms))
].sort((a, b) => a - b)

const matchingApartmentsCount = computed(() => {
  return apartments.filter((apartment) => {
    const matchesCity =
      selectedCity.value === '' || apartment.city === selectedCity.value

    const matchesRooms =
      selectedRooms.value === '' ||
      (selectedRooms.value === 4
        ? apartment.rooms >= 4
        : apartment.rooms === selectedRooms.value)

    const matchesMaxPrice =
      selectedMaxPrice.value === '' || apartment.price <= selectedMaxPrice.value

    return matchesCity && matchesRooms && matchesMaxPrice
  }).length
})

const searchButtonLabel = computed(() => {
  const count = matchingApartmentsCount.value

  if (count === 0) {
    return 'Brak pasujących ofert'
  }

  if (count === 1) {
    return 'Pokaż 1 ofertę'
  }

  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  const usesOferty =
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    (lastTwoDigits < 12 || lastTwoDigits > 14)

  return `Pokaż ${count} ${usesOferty ? 'oferty' : 'ofert'}`
})

const getInvestmentApartmentsCount = (investmentId) => {
  return apartments.filter((apartment) => {
    return apartment.investmentId === investmentId
  }).length
}

const featuredApartments = computed(() => {
  return apartments
    .filter((apartment) => apartment.featured)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
})

const purchaseSteps = [
  {
    number: '01',
    title: 'Wybierz mieszkanie',
    description:
      'Skorzystaj z filtrów, porównaj lokale i wybierz przestrzeń dopasowaną do swoich potrzeb.'
  },
  {
    number: '02',
    title: 'Umów spotkanie',
    description:
      'Porozmawiaj z doradcą i poznaj szczegóły inwestycji, finansowania oraz dostępnych lokali.'
  },
  {
    number: '03',
    title: 'Podpisz umowę',
    description:
      'Zarezerwuj mieszkanie i przejdź przez proces formalny ze wsparciem naszego zespołu.'
  },
  {
    number: '04',
    title: 'Odbierz klucze',
    description:
      'Po zakończeniu inwestycji odbierz swoje mieszkanie i rozpocznij nowy etap.'
  }
]
</script>

<template>
  <main>
    <section class="hero">
      <div class="hero__container container">
        <div class="hero__content">
          <p class="hero__eyebrow">Nowoczesne inwestycje</p>

          <h1 class="hero__title">
            Mieszkania stworzone
            <span>do dobrego życia</span>
          </h1>

          <p class="hero__description">
            Odkryj starannie wybrane mieszkania w najlepszych lokalizacjach i
            znajdź przestrzeń dopasowaną do Twojego życia.
          </p>

          <form
            class="search"
            @submit.prevent="searchApartments"
          >
            <div class="search__field">
              <label for="location">Lokalizacja</label>

              <select
                id="location"
                v-model="selectedCity"
              >
                <option value="">Wszystkie lokalizacje</option>
                <option
                  v-for="city in cities"
                  :key="city"
                  :value="city"
                >
                  {{ city }}
                </option>
              </select>
            </div>

            <div class="search__field">
              <label for="rooms">Liczba pokoi</label>

              <select
                id="rooms"
                v-model="selectedRooms"
              >
                <option value="">Dowolna</option>
                <option
                  v-for="rooms in roomOptions"
                  :key="rooms"
                  :value="rooms"
                >
                  {{
                    rooms === 1
                      ? '1 pokój'
                      : `${rooms}${rooms === 4 ? '+' : ''} pokoje`
                  }}
                </option>
              </select>
            </div>

            <div class="search__field">
              <label for="price">Cena do</label>

              <select
                id="price"
                v-model="selectedMaxPrice"
              >
                <option value="">Bez limitu</option>
                <option :value="500000">500 000 zł</option>
                <option :value="800000">800 000 zł</option>
                <option :value="1100000">1 100 000 zł</option>
                <option :value="1400000">1 400 000 zł</option>
              </select>
            </div>

            <button
              type="submit"
              :disabled="matchingApartmentsCount === 0"
            >
              {{ searchButtonLabel }}

              <span
                v-if="matchingApartmentsCount > 0"
                aria-hidden="true"
              >
                →
              </span>
            </button>
          </form>
        </div>

        <div class="hero__visual">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
            alt="Nowoczesne wnętrze apartamentu"
          />

          <div class="hero__badge">
            <strong>{{ apartments.length }}</strong>
            <span>
              mieszkań
              <br />
              w ofercie
            </span>
          </div>

          <div class="hero__location">
            <span class="hero__location-icon">⌖</span>

            <div>
              <small>Nowa inwestycja</small>
              <strong>Zielone Tarasy, Kraków</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="home-investments">
      <div class="container">
        <div class="home-investments__header">
          <div>
            <p>Nasze inwestycje</p>
            <h2>Znajdź miejsce dla siebie</h2>
          </div>

          <RouterLink to="/inwestycje">
            Zobacz wszystkie
            <span aria-hidden="true">→</span>
          </RouterLink>
        </div>

        <div class="home-investments__grid">
          <InvestmentCard
            v-for="investment in investments"
            :key="investment.id"
            :investment="investment"
            :apartments-count="getInvestmentApartmentsCount(investment.id)"
          />
        </div>
      </div>
    </section>

    <section class="featured-apartments">
      <div class="container">
        <div class="featured-apartments__header">
          <div>
            <p>Wybrane oferty</p>
            <h2>Polecane mieszkania</h2>
          </div>

          <RouterLink to="/mieszkania">
            Zobacz wszystkie mieszkania
            <span aria-hidden="true">→</span>
          </RouterLink>
        </div>

        <ApartmentGrid :apartments="featuredApartments" />
      </div>
    </section>

    <section class="purchase-process">
      <div class="container">
        <div class="purchase-process__header">
          <p>Prosta droga do własnego mieszkania</p>
          <h2>Jak wygląda proces zakupu?</h2>
        </div>

        <div class="purchase-process__steps">
          <article
            v-for="step in purchaseSteps"
            :key="step.number"
            class="purchase-process__step"
          >
            <span class="purchase-process__number">
              {{ step.number }}
            </span>

            <h3>{{ step.title }}</h3>

            <p>{{ step.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="home-cta">
      <div class="home-cta__content container">
        <div>
          <p>Znajdź swoje miejsce</p>
          <h2>Gotowy na wybór mieszkania?</h2>
        </div>

        <RouterLink to="/mieszkania">
          Przeglądaj mieszkania
          <span aria-hidden="true">→</span>
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  padding-top: 138px;
  padding-bottom: 50px;
  overflow: hidden;
}

.hero__container {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(380px, 0.82fr);
  align-items: center;
  gap: clamp(50px, 7vw, 110px);
}

.hero__content {
  position: relative;
  z-index: 2;
}

.hero__eyebrow {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 12px;
  color: var(--color-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hero__eyebrow::before {
  width: 38px;
  height: 1px;
  content: '';
  background-color: var(--color-accent);
}

.hero__title {
  max-width: 750px;
  margin-bottom: 30px;
  color: var(--color-primary);
  font-family: var(--font-body);
  font-size: clamp(48px, 5.2vw, 76px);
  font-weight: 600;
  line-height: 1.02;
  letter-spacing: -0.055em;
}

.hero__title span {
  position: relative;
  display: block;
  width: fit-content;
  margin-top: 10px;
  color: var(--color-accent);
  font-family: var(--font-heading);
  font-weight: 400;
  letter-spacing: -0.025em;
}

.hero__title span::after {
  position: absolute;
  right: 0;
  bottom: -9px;
  width: 38%;
  height: 2px;
  content: '';
  background-color: var(--color-accent);
}

.hero__description {
  max-width: 600px;
  margin-bottom: 44px;
  color: var(--color-text-muted);
  font-size: clamp(16px, 1.6vw, 19px);
}

.hero__visual {
  position: relative;
  height: min(68vh, 720px);
  min-height: 540px;
}

.hero__visual::before {
  position: absolute;
  z-index: -1;
  top: -32px;
  right: -80px;
  width: 75%;
  height: 55%;
  content: '';
  background-color: #e5ddcf;
  border-radius: 50% 0 0 50%;
}

.hero__visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 180px 0 0 0;
}

.hero__badge {
  position: absolute;
  top: 38px;
  left: -48px;
  display: grid;
  width: 150px;
  height: 150px;
  grid-template-columns: auto 1fr;
  align-items: center;
  padding: 24px 18px;
  column-gap: 6px;
  color: var(--color-surface);
  background-color: var(--color-primary);
  border: 8px solid var(--color-background);
  border-radius: 50%;
}

.hero__badge strong {
  font-family: var(--font-heading);
  font-size: 42px;
  font-weight: 400;
  line-height: 1;
}

.hero__badge span {
  font-size: 9px;
  font-weight: 700;
  line-height: 1.35;
  text-transform: uppercase;
}

.hero__location {
  position: absolute;
  right: -24px;
  bottom: 28px;
  display: flex;
  align-items: center;
  min-width: 290px;
  padding: 18px 22px;
  gap: 15px;
  background-color: var(--color-surface);
  box-shadow: var(--shadow-small);
}

.hero__location-icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  place-items: center;
  color: var(--color-surface);
  background-color: var(--color-accent);
  font-size: 23px;
  border-radius: 50%;
}

.hero__location div {
  display: flex;
  flex-direction: column;
}

.hero__location small {
  margin-bottom: 3px;
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero__location strong {
  color: var(--color-primary);
  font-size: 13px;
}

.search {
  position: relative;
  z-index: 3;
  display: grid;
  width: min(780px, calc(100vw - 40px));
  grid-template-columns: repeat(3, minmax(145px, 1fr)) auto;
  padding: 10px;
  background-color: var(--color-surface);
  box-shadow: 0 18px 50px rgba(23, 63, 53, 0.13);
}

.search__field {
  padding: 5px 20px;
  border-right: 1px solid var(--color-border);
}

.search__field label {
  display: block;
  margin-bottom: 4px;
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.search__field select {
  width: 100%;
  padding: 3px 22px 3px 0;
  color: var(--color-text);
  background-color: transparent;
  border: 0;
  outline: 0;
  font-size: 13px;
  font-weight: 600;
}

.search button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 126px;
  padding: 0 22px;
  gap: 13px;
  color: var(--color-surface);
  background-color: var(--color-primary);
  border: 0;
  font-size: 13px;
  font-weight: 700;
  transition: background-color 0.25s ease;
}

.search button:disabled {
  color: rgba(255, 255, 255, 0.65);
  background-color: #929896;
  cursor: not-allowed;
}

.search button:hover {
  background-color: var(--color-primary-light);
}

.search button span {
  font-size: 18px;
  transition: transform 0.25s ease;
}

.search button:not(:disabled):hover span {
  transform: translateX(4px);
}

.home-investments {
  padding-block: clamp(70px, 9vw, 120px);
  background-color: #f3f1eb;
}

.home-investments__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 42px;
  gap: 30px;
}

.home-investments__header p {
  margin-bottom: 10px;
  color: var(--color-accent);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.home-investments__header h2 {
  max-width: 650px;
  margin-bottom: 0;
  font-size: clamp(38px, 5vw, 58px);
}

.home-investments__header > a {
  display: inline-flex;
  align-items: center;
  padding-bottom: 7px;
  gap: 14px;
  color: var(--color-primary);
  border-bottom: 1px solid rgba(23, 63, 53, 0.25);
  font-size: 11px;
  font-weight: 700;
}

.home-investments__header > a span {
  font-size: 18px;
  transition: transform 0.2s ease;
}

.home-investments__header > a:hover span {
  transform: translateX(4px);
}

.home-investments__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.featured-apartments {
  padding-block: clamp(70px, 9vw, 120px);
  background-color: var(--color-background);
}

.featured-apartments__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 42px;
  gap: 30px;
}

.featured-apartments__header p {
  margin-bottom: 10px;
  color: var(--color-accent);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.featured-apartments__header h2 {
  margin-bottom: 0;
  font-size: clamp(38px, 5vw, 58px);
}

.featured-apartments__header > a {
  display: inline-flex;
  align-items: center;
  padding-bottom: 7px;
  gap: 14px;
  color: var(--color-primary);
  border-bottom: 1px solid rgba(23, 63, 53, 0.25);
  font-size: 11px;
  font-weight: 700;
}

.featured-apartments__header > a span {
  font-size: 18px;
  transition: transform 0.2s ease;
}

.featured-apartments__header > a:hover span {
  transform: translateX(4px);
}

.purchase-process {
  padding-block: clamp(70px, 9vw, 120px);
  color: #ffffff;
  background-color: var(--color-primary);
}

.purchase-process__header {
  max-width: 700px;
  margin-bottom: 55px;
}

.purchase-process__header > p {
  margin-bottom: 12px;
  color: var(--color-accent);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.purchase-process__header h2 {
  margin-bottom: 0;
  color: #ffffff;
  font-size: clamp(38px, 5vw, 58px);
}

.purchase-process__steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.purchase-process__step {
  position: relative;
  padding: 34px 28px 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.purchase-process__step:not(:last-child) {
  border-right: 1px solid rgba(255, 255, 255, 0.12);
}

.purchase-process__number {
  position: absolute;
  top: 0;
  left: 28px;
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  color: var(--color-primary);
  background-color: var(--color-accent);
  border-radius: 50%;
  font-family: var(--font-heading);
  font-size: 15px;
  transform: translateY(-50%);
}

.purchase-process__step h3 {
  margin: 18px 0 14px;
  color: #ffffff;
  font-size: 18px;
}

.purchase-process__step p {
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.62);
  font-size: 13px;
  line-height: 1.7;
}

.home-cta {
  padding-block: clamp(60px, 8vw, 95px);
  background-color: var(--color-accent);
}

.home-cta__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}

.home-cta p {
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.home-cta h2 {
  max-width: 700px;
  margin-bottom: 0;
  color: #ffffff;
  font-size: clamp(36px, 5vw, 56px);
}

.home-cta a {
  display: inline-flex;
  min-height: 58px;
  align-items: center;
  flex-shrink: 0;
  padding-inline: 26px;
  gap: 18px;
  color: #ffffff;
  background-color: var(--color-primary);
  font-size: 11px;
  font-weight: 700;
}

.home-cta a span {
  font-size: 19px;
  transition: transform 0.2s ease;
}

.home-cta a:hover span {
  transform: translateX(5px);
}

@media (max-width: 991px) {
  .hero {
    padding-top: 130px;
  }

  .hero__container {
    grid-template-columns: 1fr;
    gap: 60px;
  }

  .hero__content {
    max-width: 760px;
  }

  .hero__visual {
    width: 85%;
    height: 620px;
    min-height: 0;
    margin-left: auto;
  }

  .hero__badge {
    left: -55px;
  }

  .search {
    width: 100%;
  }

  .home-investments__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .purchase-process__steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 50px 0;
  }

  .purchase-process__step:nth-child(2) {
    border-right: 0;
  }
}

@media (max-width: 767px) {
  .hero {
    padding-top: 125px;
    padding-bottom: 40px;
  }

  .hero__title {
    font-size: clamp(44px, 9vw, 62px);
  }

  .hero__description {
    margin-bottom: 34px;
  }

  .search {
    grid-template-columns: 1fr 1fr;
  }

  .search__field {
    border-bottom: 1px solid var(--color-border);
  }

  .search__field:nth-child(2) {
    border-right: 0;
  }

  .search__field:nth-child(3) {
    grid-column: 1 / -1;
    border-right: 0;
  }

  .search button {
    min-height: 58px;
    grid-column: 1 / -1;
    margin-top: 8px;
  }

  .hero__visual {
    width: calc(100% - 30px);
    height: 520px;
  }

  .hero__badge {
    top: 24px;
    left: -30px;
    width: 135px;
    height: 135px;
    padding: 20px 15px;
    border-width: 6px;
  }

  .hero__badge strong {
    font-size: 37px;
  }

  .hero__location {
    right: 16px;
    bottom: 20px;
  }

  .home-investments__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .home-investments__grid {
    grid-template-columns: 1fr;
  }

  .featured-apartments__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .purchase-process__steps {
    grid-template-columns: 1fr;
    gap: 50px;
  }

  .purchase-process__step {
    border-right: 0;
  }

  .home-cta__content {
    align-items: flex-start;
    flex-direction: column;
  }

  .home-cta a {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 479px) {
  .hero {
    padding-top: 110px;
  }

  .hero__eyebrow {
    margin-bottom: 18px;
    font-size: 10px;
  }

  .hero__title {
    margin-bottom: 28px;
    font-size: clamp(39px, 11vw, 48px);
    letter-spacing: -0.045em;
  }

  .hero__title span {
    margin-top: 7px;
  }

  .hero__description {
    font-size: 16px;
  }

  .search {
    grid-template-columns: 1fr;
  }

  .search__field,
  .search__field:nth-child(3) {
    grid-column: auto;
    padding: 13px 15px;
    border-right: 0;
  }

  .search button {
    grid-column: auto;
  }

  .hero__visual {
    width: calc(100% - 15px);
    height: 440px;
  }

  .hero__visual img {
    border-radius: 90px 0 0 0;
  }

  .hero__badge {
    top: 18px;
    left: -15px;
    width: 118px;
    height: 118px;
    padding: 17px 13px;
    border-width: 5px;
  }

  .hero__badge strong {
    font-size: 32px;
  }

  .hero__badge span {
    font-size: 7px;
  }

  .hero__location {
    right: 10px;
    bottom: 14px;
    left: 10px;
    min-width: 0;
    padding: 15px;
  }
}
</style>
