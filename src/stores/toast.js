import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', () => {
  const toast = ref({
    isVisible: false,
    message: '',
    type: 'success'
  })

  let toastTimer = null

  const hideToast = () => {
    toast.value.isVisible = false
  }

  const showToast = (message, type = 'success', duration = 3000) => {
    if (toastTimer) {
      clearTimeout(toastTimer)
    }

    toast.value = {
      isVisible: true,
      message,
      type
    }

    toastTimer = setTimeout(() => {
      hideToast()
    }, duration)
  }

  return {
    toast,
    showToast,
    hideToast
  }
})
