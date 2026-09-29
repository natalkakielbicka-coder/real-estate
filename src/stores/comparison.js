import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useToastStore } from './toast'

const STORAGE_KEY = 'comparison-apartment-ids'
const MAX_COMPARISON_APARTMENTS = 3

export const useComparisonStore = defineStore('comparison', () => {
  const { showToast } = useToastStore()

  const comparisonApartmentIds = ref([])

  const comparisonCount = computed(() => {
    return comparisonApartmentIds.value.length
  })

  const isComparisonFull = computed(() => {
    return comparisonCount.value >= MAX_COMPARISON_APARTMENTS
  })

  const loadComparison = () => {
    try {
      const savedApartmentIds = localStorage.getItem(STORAGE_KEY)

      if (!savedApartmentIds) {
        return
      }

      const parsedApartmentIds = JSON.parse(savedApartmentIds)

      if (!Array.isArray(parsedApartmentIds)) {
        return
      }

      comparisonApartmentIds.value = [
        ...new Set(
          parsedApartmentIds.filter((apartmentId) => {
            return Number.isInteger(apartmentId)
          })
        )
      ].slice(0, MAX_COMPARISON_APARTMENTS)
    } catch {
      comparisonApartmentIds.value = []
    }
  }

  const isInComparison = (apartmentId) => {
    return comparisonApartmentIds.value.includes(apartmentId)
  }

  const toggleComparison = (apartmentId) => {
    const apartmentIsSelected = isInComparison(apartmentId)

    if (!apartmentIsSelected && isComparisonFull.value) {
      showToast('Możesz porównać maksymalnie 3 mieszkania', 'error')
      return
    }

    const nextApartmentIds = apartmentIsSelected
      ? comparisonApartmentIds.value.filter((id) => {
          return id !== apartmentId
        })
      : [...comparisonApartmentIds.value, apartmentId]

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextApartmentIds))

      comparisonApartmentIds.value = nextApartmentIds

      showToast(
        apartmentIsSelected
          ? 'Mieszkanie usunięto z porównania'
          : 'Mieszkanie dodano do porównania',
        'success'
      )
    } catch {
      showToast('Nie udało się zapisać porównania', 'error')
    }
  }

  const clearComparison = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)

      comparisonApartmentIds.value = []

      showToast('Wyczyszczono porównanie', 'success')
    } catch {
      showToast('Nie udało się wyczyścić porównania', 'error')
    }
  }

  loadComparison()

  return {
    comparisonApartmentIds,
    comparisonCount,
    isComparisonFull,
    isInComparison,
    toggleComparison,
    clearComparison
  }
})
