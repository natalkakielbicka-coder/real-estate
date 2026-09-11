<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { apartments } from '../data/apartments'
import { investments } from '../data/investments'
import InvestmentCard from '../components/InvestmentCard.vue'
import ApartmentGrid from '../components/ApartmentGrid.vue'
import { getApartmentsCountByInvestment } from '../utils/investmentHelpers'

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
      apartment.rooms === Number(selectedRooms.value)

    const matchesMaxPrice =
      selectedMaxPrice.value === '' ||
      apartment.price <= Number(selectedMaxPrice.value)

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
    <section
      class="flex items-center overflow-hidden pt-[110px] pb-10 xs:pt-[125px] sm:pt-[130px] sm:pb-[50px] md:pt-[138px]"
    >
      <div
        class="container grid grid-cols-1 items-center gap-[60px] md:grid-cols-[minmax(0,1fr)_minmax(380px,0.82fr)] md:gap-[clamp(50px,7vw,110px)]"
      >
        <div class="relative z-[2] sm:max-w-[760px] md:max-w-none">
          <p
            class="mb-5 text-[11px] font-bold tracking-[0.16em] text-gold uppercase"
          >
            Nowoczesne inwestycje
          </p>

          <h1
            class="mb-[30px] max-w-[750px] text-[clamp(48px,6vw,76px)] text-brand"
          >
            Mieszkania stworzone

            <span class="block text-gold"> do dobrego życia </span>
          </h1>

          <p class="mb-[34px] max-w-[600px] text-[17px] text-muted sm:mb-11">
            Odkryj starannie wybrane mieszkania w najlepszych lokalizacjach i
            znajdź przestrzeń dopasowaną do Twojego życia.
          </p>

          <form
            class="relative z-[3] grid w-full grid-cols-1 bg-panel p-2.5 shadow-[0_18px_50px_rgba(23,63,53,0.13)] xs:grid-cols-2 md:w-[min(780px,calc(100vw-40px))] md:grid-cols-[repeat(3,minmax(145px,1fr))_auto]"
            @submit.prevent="searchApartments"
          >
            <div
              class="border-b border-line px-[15px] py-[13px] xs:border-r xs:px-5 xs:py-[5px] md:border-b-0"
            >
              <label
                class="mb-1 block text-[10px] font-bold tracking-[0.08em] text-muted uppercase"
                for="location"
              >
                Lokalizacja
              </label>

              <select
                id="location"
                v-model="selectedCity"
                class="w-full border-0 bg-transparent py-[3px] pr-[22px] text-[13px] font-semibold text-[var(--color-text)] outline-0"
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

            <div
              class="border-b border-line px-[15px] py-[13px] xs:px-5 xs:py-[5px] md:border-r md:border-b-0"
            >
              <label
                class="mb-1 block text-[10px] font-bold tracking-[0.08em] text-muted uppercase"
                for="rooms"
              >
                Liczba pokoi
              </label>

              <select
                id="rooms"
                v-model="selectedRooms"
                class="w-full border-0 bg-transparent py-[3px] pr-[22px] text-[13px] font-semibold text-[var(--color-text)] outline-0"
              >
                <option value="">Dowolna</option>

                <option
                  v-for="rooms in roomOptions"
                  :key="rooms"
                  :value="rooms"
                >
                  {{ rooms === 1 ? '1 pokój' : `${rooms} pokoje` }}
                </option>
              </select>
            </div>

            <div
              class="border-b border-line px-[15px] py-[13px] xs:col-span-2 xs:px-5 xs:py-[5px] md:col-span-1 md:border-r md:border-b-0"
            >
              <label
                class="mb-1 block text-[10px] font-bold tracking-[0.08em] text-muted uppercase"
                for="price"
              >
                Cena do
              </label>

              <select
                id="price"
                v-model="selectedMaxPrice"
                class="w-full border-0 bg-transparent py-[3px] pr-[22px] text-[13px] font-semibold text-[var(--color-text)] outline-0"
              >
                <option value="">Bez limitu</option>
                <option :value="500000">500 000 zł</option>
                <option :value="800000">800 000 zł</option>
                <option :value="1100000">1 100 000 zł</option>
                <option :value="1400000">1 400 000 zł</option>
              </select>
            </div>

            <button
              class="group mt-2 flex min-h-[58px] items-center justify-center gap-[13px] border-0 bg-brand px-[22px] text-[13px] font-bold text-white transition-colors duration-[250ms] enabled:hover:bg-brand-light disabled:cursor-not-allowed disabled:bg-sold disabled:text-white/65 xs:col-span-2 md:col-span-1 md:mt-0 md:min-w-[126px]"
              type="submit"
              :disabled="matchingApartmentsCount === 0"
            >
              {{ searchButtonLabel }}

              <span
                v-if="matchingApartmentsCount > 0"
                class="text-lg transition-transform duration-[250ms] group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </button>
          </form>
        </div>

        <div
          class="hero__visual relative z-[1] ml-auto h-[480px] min-h-0 w-[calc(100%-30px)] xs:h-[520px] sm:h-[620px] sm:w-[85%] md:ml-0 md:h-[min(68vh,720px)] md:min-h-[540px] md:w-full"
        >
          <img
            class="block h-full w-full rounded-tl-[100px] object-cover xs:rounded-tl-[140px] sm:rounded-tl-[180px]"
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
            alt="Nowoczesne wnętrze apartamentu"
          />

          <div
            class="absolute top-6 -left-[30px] grid size-[135px] grid-cols-[auto_1fr] items-center gap-x-1.5 rounded-full border-[6px] border-page bg-brand px-[15px] py-5 text-panel sm:top-[38px] sm:-left-[55px] sm:size-[150px] sm:border-8 sm:px-[18px] sm:py-6 md:-left-12"
          >
            <strong
              class="font-display text-[37px] leading-none font-normal sm:text-[42px]"
            >
              {{ apartments.length }}
            </strong>

            <span class="text-[9px] leading-[1.35] font-bold uppercase">
              mieszkań
              <br />
              w ofercie
            </span>
          </div>

          <div
            class="absolute right-4 bottom-5 flex min-w-[250px] items-center gap-[15px] bg-panel px-[18px] py-4 shadow-[0_14px_40px_rgba(23,63,53,0.14)] xs:min-w-[290px] xs:px-[22px] xs:py-[18px] md:-right-6 md:bottom-7"
          >
            <span
              class="grid size-[42px] shrink-0 place-items-center rounded-full bg-brand text-xl text-white"
              aria-hidden="true"
            >
              ⌖
            </span>

            <div class="flex min-w-0 flex-col">
              <small
                class="mb-[3px] text-[10px] font-bold tracking-[0.08em] text-muted uppercase"
              >
                Nowa inwestycja
              </small>

              <strong class="text-[13px] leading-[1.35] font-bold text-brand">
                Zielone Tarasy, Kraków
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-[#f3f1eb] py-[clamp(70px,9vw,120px)]">
      <div class="container">
        <div
          class="mb-[42px] flex items-end justify-between gap-[30px] max-sm:flex-col max-sm:items-start"
        >
          <div>
            <p
              class="mb-2.5 text-[10px] font-bold tracking-[0.13em] text-gold uppercase"
            >
              Nasze inwestycje
            </p>

            <h2 class="mb-0 max-w-[650px] text-[clamp(38px,5vw,58px)]">
              Znajdź miejsce dla siebie
            </h2>
          </div>

          <RouterLink
            class="group inline-flex items-center gap-3.5 border-b border-[rgba(23,63,53,0.25)] pb-[7px] text-[11px] font-bold text-brand"
            to="/inwestycje"
          >
            Zobacz wszystkie

            <span
              class="text-lg transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </RouterLink>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          <InvestmentCard
            v-for="investment in investments"
            :key="investment.id"
            :investment="investment"
            :apartments-count="
              getApartmentsCountByInvestment(apartments, investment.id)
            "
          />
        </div>
      </div>
    </section>

    <section class="bg-page py-[clamp(70px,9vw,120px)]">
      <div class="container">
        <div
          class="mb-[42px] flex items-end justify-between gap-[30px] max-sm:flex-col max-sm:items-start"
        >
          <div>
            <p
              class="mb-2.5 text-[10px] font-bold tracking-[0.13em] text-gold uppercase"
            >
              Wybrane oferty
            </p>

            <h2 class="mb-0 text-[clamp(38px,5vw,58px)]">
              Polecane mieszkania
            </h2>
          </div>

          <RouterLink
            class="group inline-flex items-center gap-3.5 border-b border-[rgba(23,63,53,0.25)] pb-[7px] text-[11px] font-bold text-brand"
            to="/mieszkania"
          >
            Zobacz wszystkie mieszkania

            <span
              class="text-lg transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </RouterLink>
        </div>

        <ApartmentGrid :apartments="featuredApartments" />
      </div>
    </section>

    <section class="bg-brand py-[clamp(70px,9vw,120px)] text-white">
      <div class="container">
        <div class="mb-[55px] max-w-[700px]">
          <p
            class="mb-3 text-[10px] font-bold tracking-[0.13em] text-gold uppercase"
          >
            Prosta droga do własnego mieszkania
          </p>

          <h2 class="mb-0 text-[clamp(38px,5vw,58px)] text-white">
            Jak wygląda proces zakupu?
          </h2>
        </div>

        <div
          class="grid grid-cols-1 gap-y-[50px] sm:grid-cols-2 md:grid-cols-4 md:gap-y-0"
        >
          <article
            v-for="step in purchaseSteps"
            :key="step.number"
            class="relative border-t border-white/20 px-7 pt-[34px] pb-2.5 sm:odd:border-r sm:odd:border-white/12 md:border-r md:border-white/12 md:last:border-r-0"
          >
            <span
              class="absolute top-0 left-7 grid size-[38px] -translate-y-1/2 place-items-center rounded-full bg-gold font-display text-[15px] text-brand"
            >
              {{ step.number }}
            </span>

            <h3 class="mt-[18px] mb-3.5 text-lg text-white">
              {{ step.title }}
            </h3>

            <p class="mb-0 text-[13px] leading-[1.7] text-white/62">
              {{ step.description }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="bg-gold py-[clamp(60px,8vw,95px)]">
      <div
        class="container flex items-center justify-between gap-10 max-sm:flex-col max-sm:items-start"
      >
        <div>
          <p
            class="mb-2.5 text-[10px] font-bold tracking-[0.13em] text-white/72 uppercase"
          >
            Znajdź swoje miejsce
          </p>

          <h2 class="mb-0 max-w-[700px] text-[clamp(36px,5vw,56px)] text-white">
            Gotowy na wybór mieszkania?
          </h2>
        </div>

        <RouterLink
          class="group inline-flex min-h-[58px] shrink-0 items-center gap-[18px] bg-brand px-[26px] text-[11px] font-bold text-white max-sm:w-full max-sm:justify-center"
          to="/mieszkania"
        >
          Przeglądaj mieszkania

          <span
            class="text-[19px] transition-transform duration-200 group-hover:translate-x-[5px]"
            aria-hidden="true"
          >
            →
          </span>
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
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
</style>
