<script setup>
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <AppHeader />

  <RouterView />
</template>

<style scoped>
main {
  padding-block: 80px;
}

p {
  color: var(--color-text-muted);
  font-size: 18px;
}
</style>