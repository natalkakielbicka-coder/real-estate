<template>
  <main
    class="not-found grid min-h-screen place-items-center pt-40 pb-20 text-center max-sm:pt-[130px] max-xs:min-h-[90vh] max-xs:px-4"
  >
    <div class="container">
      <p
        class="not-found__code mb-4 font-display text-[clamp(80px,15vw,170px)] leading-[0.8] text-gold"
      >
        404
      </p>

      <h1 class="mb-5 text-[clamp(38px,6vw,68px)]">Nie znaleziono strony</h1>

      <p class="mx-auto mb-[30px] max-w-[520px] text-muted">
        Strona, której szukasz, nie istnieje lub została przeniesiona.
      </p>

      <RouterLink
        class="inline-flex items-center gap-3 bg-brand px-[22px] py-[15px] text-xs font-bold tracking-[0.06em] text-white! uppercase transition-colors duration-[250ms] hover:bg-gold hover:text-brand! max-xs:w-full max-xs:justify-center"
        to="/"
      >
        Wróć na stronę główną
        <span aria-hidden="true">→</span>
      </RouterLink>
    </div>
  </main>
</template>
