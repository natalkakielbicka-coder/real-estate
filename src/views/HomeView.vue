<template>
  <main class="home">
    <div class="container">
      <p class="home__eyebrow">Nowoczesne inwestycje</p>

      <h1>Znajdź przestrzeń dla siebie</h1>

      <p class="home__description">
        Przeglądaj dostępne mieszkania i wybierz miejsce,
        które najlepiej odpowiada Twoim potrzebom.
      </p>
    </div>
  </main>
</template>

<style scoped>
.home {
  display: flex;
  align-items: center;
  min-height: 100vh;
  padding-top: 168px;
  padding-bottom: 80px;
}

.home__eyebrow {
  margin-bottom: 20px;
  color: var(--color-accent);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

h1 {
  max-width: 900px;
  margin-bottom: 28px;
}

.home__description {
  max-width: 620px;
  margin-bottom: 0;
  color: var(--color-text-muted);
  font-size: clamp(17px, 2vw, 20px);
}
</style>