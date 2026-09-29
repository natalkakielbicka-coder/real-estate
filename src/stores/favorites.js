import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useToastStore } from './toast'

const STORAGE_KEY = 'favorite-apartment-ids'

export const useFavoritesStore = defineStore('favorites', () => {
  const { showToast } = useToastStore()

  const favoriteApartmentIds = ref([])

  const favoriteCount = computed(() => {
    return favoriteApartmentIds.value.length
  })

  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem(STORAGE_KEY)

      if (!savedFavorites) {
        return
      }

      const parsedFavorites = JSON.parse(savedFavorites)

      if (!Array.isArray(parsedFavorites)) {
        return
      }

      favoriteApartmentIds.value = [
        ...new Set(
          parsedFavorites.filter((apartmentId) => {
            return Number.isInteger(apartmentId)
          })
        )
      ]
    } catch {
      favoriteApartmentIds.value = []
    }
  }

  const isFavorite = (apartmentId) => {
    return favoriteApartmentIds.value.includes(apartmentId)
  }

  const toggleFavorite = (apartmentId) => {
    const wasFavorite = isFavorite(apartmentId)

    const nextFavoriteIds = wasFavorite
      ? favoriteApartmentIds.value.filter((id) => id !== apartmentId)
      : [...favoriteApartmentIds.value, apartmentId]

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavoriteIds))
      favoriteApartmentIds.value = nextFavoriteIds

      showToast(
        wasFavorite
          ? 'Mieszkanie usunięto z ulubionych'
          : 'Mieszkanie dodano do ulubionych',
        'success'
      )
    } catch {
      showToast('Nie udało się zapisać ulubionych', 'error')
    }
  }

  loadFavorites()

  return {
    favoriteApartmentIds,
    favoriteCount,
    isFavorite,
    toggleFavorite
  }
})
