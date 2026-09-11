<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

watch(
  () => route.fullPath,
  () => {
    closeMenu()
  }
)
</script>

<template>
  <header
    class="fixed top-0 left-0 z-[100] w-full border-b border-[rgba(23,63,53,0.1)] bg-[rgba(246,244,239,0.92)] backdrop-blur-[16px]"
  >
    <div
      class="container flex min-h-[74px] items-center justify-between gap-8 sm:min-h-[88px]"
    >
      <RouterLink
        class="flex shrink-0 items-center gap-3"
        to="/"
        aria-label="Residence – strona główna"
      >
        <span
          class="grid size-[42px] place-items-center rounded-full bg-brand font-display text-[25px] text-panel"
        >
          R
        </span>

        <span class="flex flex-col leading-none">
          <strong class="font-display text-[21px] font-normal text-brand">
            Residence
          </strong>

          <small
            class="mt-[5px] text-[9px] font-bold tracking-[0.18em] text-muted uppercase"
          >
            Real Estate
          </small>
        </span>
      </RouterLink>

      <!-- Jeden nav dla mobile i desktopu -->
      <nav
        id="main-navigation"
        class="absolute top-full left-0 flex w-full flex-col border-t border-line bg-page px-[var(--container-padding)] py-5 shadow-[0_18px_40px_rgba(23,63,53,0.12)] transition-[opacity,visibility] duration-200 md:static md:visible md:h-[88px] md:w-auto md:flex-row md:items-center md:gap-[clamp(20px,3vw,42px)] md:border-0 md:bg-transparent md:p-0 md:opacity-100 md:shadow-none"
        :class="isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'"
        aria-label="Główna nawigacja"
      >
        <RouterLink
          class="navigation__link"
          to="/"
        >
          Strona główna
        </RouterLink>

        <RouterLink
          class="navigation__link"
          to="/mieszkania"
        >
          Mieszkania
        </RouterLink>

        <RouterLink
          class="navigation__link"
          to="/inwestycje"
        >
          Inwestycje
        </RouterLink>

        <RouterLink
          class="navigation__link navigation__link--calculator"
          to="/kalkulator-kosztow-zakupu"
        >
          Kalkulator kosztów
        </RouterLink>

        <a
          class="navigation__link"
          href="#kontakt"
          @click="closeMenu"
        >
          Kontakt
        </a>
      </nav>

      <div class="flex items-center gap-3">
        <RouterLink
          class="group hidden min-h-12 items-center gap-3.5 bg-brand px-[22px] text-[13px] font-bold text-panel transition-[background-color,transform] duration-[250ms] hover:-translate-y-0.5 hover:bg-brand-light md:inline-flex"
          to="/mieszkania"
        >
          Znajdź mieszkanie

          <span
            class="text-lg transition-transform duration-[250ms] group-hover:translate-x-1"
            aria-hidden="true"
          >
            →
          </span>
        </RouterLink>

        <button
          class="relative grid size-11 place-items-center border border-line bg-transparent md:hidden"
          type="button"
          aria-label="Otwórz lub zamknij menu"
          aria-controls="main-navigation"
          :aria-expanded="isMenuOpen"
          @click="toggleMenu"
        >
          <span class="relative block h-[18px] w-6">
            <span
              class="absolute top-0 left-0 h-0.5 w-full bg-brand transition-transform duration-300"
              :class="isMenuOpen ? 'translate-y-2 rotate-45' : ''"
            ></span>

            <span
              class="absolute top-2 left-0 h-0.5 w-full bg-brand transition-opacity duration-300"
              :class="isMenuOpen ? 'opacity-0' : 'opacity-100'"
            ></span>

            <span
              class="absolute top-4 left-0 h-0.5 w-full bg-brand transition-transform duration-300"
              :class="isMenuOpen ? '-translate-y-2 -rotate-45' : ''"
            ></span>
          </span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navigation__link {
  position: relative;
  padding-block: 15px;
  color: var(--color-text);
  font-size: 15px;
  font-weight: 600;
  border-bottom: 1px solid var(--color-border);
}

.navigation__link.router-link-active {
  color: var(--color-accent);
}

.navigation__link--calculator {
  margin-top: 8px;
  padding-inline: 14px;
  color: var(--color-primary);
  background-color: rgba(199, 157, 98, 0.14);
  border: 1px solid rgba(199, 157, 98, 0.45);
  transition:
    color 0.25s ease,
    background-color 0.25s ease,
    transform 0.25s ease;
}

.navigation__link--calculator:hover,
.navigation__link--calculator.router-link-active {
  color: var(--color-primary);
  background-color: rgba(199, 157, 98, 0.3);
}

@media (min-width: 992px) {
  .navigation__link {
    display: flex;
    align-items: center;
    height: 100%;
    padding-block: 0;
    font-size: 14px;
    border-bottom: 0;
  }

  .navigation__link::after {
    position: absolute;
    right: 0;
    bottom: 26px;
    left: 0;
    height: 1px;
    content: '';
    background-color: var(--color-accent);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }
  .navigation__link:hover::after,
  .navigation__link.router-link-active::after {
    transform: scaleX(1);
    transform-origin: left;
  }

  .navigation__link--calculator {
    height: 42px;
    margin-top: 0;
    padding-inline: 14px;
    border: 1px solid rgba(199, 157, 98, 0.45);
  }

  .navigation__link--calculator::after {
    display: none;
  }
}
</style>
