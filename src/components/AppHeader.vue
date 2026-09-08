<template>
  <header
    class="fixed top-0 left-0 z-[100] w-full border-b border-[rgba(23,63,53,0.1)] bg-[rgba(246,244,239,0.92)] backdrop-blur-[16px]"
  >
    <div
      class="container flex min-h-[88px] items-center justify-between gap-8 max-sm:min-h-[74px]"
    >
      <RouterLink
        class="flex shrink-0 items-center gap-3"
        to="/"
      >
        <span
          class="grid h-[42px] w-[42px] place-items-center rounded-full bg-brand font-display text-[25px] text-panel"
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

      <nav
        class="hidden items-center gap-[clamp(20px,3vw,42px)] md:flex"
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

        <a
          class="navigation__link"
          href="#"
        >
          Kontakt
        </a>
      </nav>

      <RouterLink
        class="group inline-flex min-h-12 items-center gap-3.5 bg-brand px-[22px] text-[13px] font-bold text-panel transition-[background-color,transform] duration-[250ms] hover:-translate-y-0.5 hover:bg-brand-light max-sm:hidden"
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
    </div>
  </header>
</template>

<style scoped>
.navigation__link {
  position: relative;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 600;
}

.navigation__link::after {
  position: absolute;
  right: 0;
  bottom: -8px;
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
</style>
