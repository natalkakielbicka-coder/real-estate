<script setup>
import AppHeader from './components/AppHeader.vue'
import AppToast from './components/AppToast.vue'
</script>

<template>
  <AppHeader />

  <RouterView />

  <AppToast />
</template>
