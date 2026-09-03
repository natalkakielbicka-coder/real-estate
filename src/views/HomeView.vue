<template>
  <main>
    <section class="hero">
      <div class="hero__container container">
        <div class="hero__content">
          <p class="hero__eyebrow">
            Nowoczesne inwestycje
          </p>

          <h1 class="hero__title">
            Mieszkania stworzone
            <span>do dobrego życia</span>
          </h1>

          <p class="hero__description">
            Odkryj starannie wybrane mieszkania w najlepszych
            lokalizacjach i znajdź przestrzeń dopasowaną do Twojego życia.
          </p>

          <form class="search">
            <div class="search__field">
              <label for="location">Lokalizacja</label>

              <select id="location">
                <option value="">Wszystkie lokalizacje</option>
                <option value="krakow">Kraków</option>
                <option value="warszawa">Warszawa</option>
                <option value="wroclaw">Wrocław</option>
              </select>
            </div>

            <div class="search__field">
              <label for="rooms">Liczba pokoi</label>

              <select id="rooms">
                <option value="">Dowolna</option>
                <option value="1">1 pokój</option>
                <option value="2">2 pokoje</option>
                <option value="3">3 pokoje</option>
                <option value="4">4+ pokoje</option>
              </select>
            </div>

            <div class="search__field">
              <label for="price">Cena do</label>

              <select id="price">
                <option value="">Bez limitu</option>
                <option value="500000">500 000 zł</option>
                <option value="700000">700 000 zł</option>
                <option value="900000">900 000 zł</option>
              </select>
            </div>

            <button type="submit">
              Szukaj
              <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>

        <div class="hero__visual">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
            alt="Nowoczesne wnętrze apartamentu"
          >

          <div class="hero__badge">
            <strong>48</strong>
            <span>
                dostępnych
                <br>
                mieszkań
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
  </main>
</template>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  min-height: 100vh;
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
  content: "";
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
  content: "";
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
  content: "";
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

.search button:hover {
  background-color: var(--color-primary-light);
}

.search button span {
  font-size: 18px;
  transition: transform 0.25s ease;
}

.search button:hover span {
  transform: translateX(4px);
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