<script setup>
import AppHeader from './components/AppHeader.vue'
import AppToast from './components/AppToast.vue'

const focusMainContent = () => {
  const main = document.querySelector('main')

  if (!main) {
    return
  }

  main.setAttribute('tabindex', '-1')
  main.focus()
}
</script>

<template>
  <button
    class="skip-to-content"
    type="button"
    @click="focusMainContent"
  >
    Przejdź do treści
  </button>

  <AppHeader />

  <RouterView />

  <AppToast />
</template>

<style scoped>
.skip-to-content {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 10000;
  padding: 0.75rem 1rem;
  border: 2px solid #ffffff;
  border-radius: 3px;
  background: var(--color-primary, #173f35);
  color: #ffffff;
  font: inherit;
  font-weight: 700;
  transform: translateY(calc(-100% - 2rem));
}

.skip-to-content:focus {
  transform: translateY(0);
  outline: 3px solid var(--color-primary, #173f35);
  outline-offset: 3px;
}
</style>
