import { ref } from 'vue'

const toast = ref({
  isVisible: false,
  message: '',
  type: 'success'
})

let toastTimer = null

export const useToast = () => {
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
}
