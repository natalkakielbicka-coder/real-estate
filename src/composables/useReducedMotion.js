import { ref, onMounted, onUnmounted } from 'vue'

export const useReducedMotion = () => {
  const reducedMotion = ref(false)

  let mediaQuery = null

  const updatePreference = (event) => {
    reducedMotion.value = event.matches
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    reducedMotion.value = mediaQuery.matches

    mediaQuery.addEventListener('change', updatePreference)
  })

  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', updatePreference)
  })

  return reducedMotion
}
