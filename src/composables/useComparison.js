import { computed, ref } from 'vue'
import { useToast } from './useToast'

const STORAGE_KEY = 'comparison-apartment-ids'
const MAX_COMPARISON_APARTMENTS = 3

const comparisonApartmentIds = ref([])

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

loadComparison()

export const useComparison = () => {
  const { showToast } = useToast()

  const comparisonCount = computed(() => {
    return comparisonApartmentIds.value.length
  })

  const isComparisonFull = computed(() => {
    return comparisonCount.value >= MAX_COMPARISON_APARTMENTS
  })

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

    comparisonApartmentIds.value = nextApartmentIds

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextApartmentIds))

      showToast(
        apartmentIsSelected
          ? 'Mieszkanie usunięto z porównania'
          : 'Mieszkanie dodano do porównania',
        'success'
      )
    } catch {
      showToast(
        'Zmieniono porównanie, ale nie udało się zapisać wyboru',
        'error'
      )
    }
  }

  const clearComparison = () => {
    comparisonApartmentIds.value = []
    localStorage.removeItem(STORAGE_KEY)

    showToast('Wyczyszczono porównanie', 'success')
  }

  return {
    comparisonApartmentIds,
    comparisonCount,
    isComparisonFull,
    isInComparison,
    toggleComparison,
    clearComparison
  }
}
