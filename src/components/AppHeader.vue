<template>
  <header class="header">
    <div class="header__container container">
      <RouterLink class="logo" to="/">
        <span class="logo__mark">R</span>

        <span class="logo__text">
          <strong>Residence</strong>
          <small>Real Estate</small>
        </span>
      </RouterLink>

      <nav class="navigation" aria-label="Główna nawigacja">
        <RouterLink to="/">Strona główna</RouterLink>
        <RouterLink to="/mieszkania">Mieszkania</RouterLink>
        <a href="#">Inwestycje</a>
        <a href="#">Kontakt</a>
      </nav>

      <RouterLink class="header__button" to="/mieszkania">
        Znajdź mieszkanie
        <span aria-hidden="true">→</span>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  border-bottom: 1px solid rgba(23, 63, 53, 0.1);
  background-color: rgba(246, 244, 239, 0.92);
  backdrop-filter: blur(16px);
}

.header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 88px;
  gap: 32px;
}

.logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 12px;
}

.logo__mark {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  color: var(--color-surface);
  background-color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: 25px;
  border-radius: 50%;
}

.logo__text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo__text strong {
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: 21px;
  font-weight: 400;
}

.logo__text small {
  margin-top: 5px;
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.navigation {
  display: flex;
  align-items: center;
  gap: clamp(20px, 3vw, 42px);
}

.navigation a {
  position: relative;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 600;
}

.navigation a::after {
  position: absolute;
  right: 0;
  bottom: -8px;
  left: 0;
  height: 1px;
  content: "";
  background-color: var(--color-accent);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.navigation a:hover::after,
.navigation a.router-link-active::after {
  transform: scaleX(1);
  transform-origin: left;
}

.header__button {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  padding: 0 22px;
  gap: 14px;
  color: var(--color-surface);
  background-color: var(--color-primary);
  font-size: 13px;
  font-weight: 700;
  border-radius: var(--radius-small);
  transition:
    background-color 0.25s ease,
    transform 0.25s ease;
}

.header__button:hover {
  background-color: var(--color-primary-light);
  transform: translateY(-2px);
}

.header__button span {
  font-size: 18px;
  transition: transform 0.25s ease;
}

.header__button:hover span {
  transform: translateX(4px);
}

@media (max-width: 991px) {
  .navigation {
    display: none;
  }
}

@media (max-width: 767px) {
  .header__container {
    min-height: 74px;
  }

  .header__button {
    display: none;
  }
}
</style>