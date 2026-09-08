<template>
  <main class="not-found">
    <div class="container">
      <p class="not-found__code">404</p>

      <h1>Nie znaleziono strony</h1>

      <p>Strona, której szukasz, nie istnieje lub została przeniesiona.</p>

      <RouterLink to="/">
        Wróć na stronę główną
        <span aria-hidden="true">→</span>
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
.not-found {
  display: grid;
  min-height: 100vh;
  padding: 160px 0 80px;
  place-items: center;
  text-align: center;
}

.not-found__code {
  margin-bottom: 16px;
  color: var(--color-accent);
  font-family: var(--font-heading);
  font-size: clamp(80px, 15vw, 170px);
  line-height: 0.8;
}

.not-found h1 {
  margin-bottom: 20px;
  font-size: clamp(38px, 6vw, 68px);
}

.not-found .container > p:not(.not-found__code) {
  max-width: 520px;
  margin: 0 auto 30px;
  color: var(--color-text-muted);
}

.not-found a {
  display: inline-flex;
  align-items: center;
  padding: 15px 22px;
  gap: 12px;
  color: #ffffff;
  background-color: var(--color-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition:
    color 0.25s ease,
    background-color 0.25s ease;
}

.not-found a:hover {
  color: var(--color-primary);
  background-color: var(--color-accent);
}

@media (max-width: 767px) {
  .not-found {
    padding-top: 130px;
  }
}

@media (max-width: 479px) {
  .not-found {
    min-height: 90vh;
    padding-inline: 4px;
  }

  .not-found a {
    width: 100%;
    justify-content: center;
  }
}
</style>
