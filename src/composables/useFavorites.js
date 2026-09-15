import { computed, ref } from 'vue'

const STORAGE_KEY = 'favorite-apartment-ids'

const favoriteApartmentIds = ref([])

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

    favoriteApartmentIds.value = parsedFavorites
  } catch {
    favoriteApartmentIds.value = []
  }
}

loadFavorites()

export const useFavorites = () => {
  const favoriteCount = computed(() => {
    return favoriteApartmentIds.value.length
  })

  const isFavorite = (apartmentId) => {
    return favoriteApartmentIds.value.includes(apartmentId)
  }

  const toggleFavorite = (apartmentId) => {
    const nextFavoriteIds = isFavorite(apartmentId)
      ? favoriteApartmentIds.value.filter((id) => id !== apartmentId)
      : [...favoriteApartmentIds.value, apartmentId]

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavoriteIds))
      favoriteApartmentIds.value = nextFavoriteIds

      return true
    } catch {
      return false
    }
  }

  return {
    favoriteApartmentIds,
    favoriteCount,
    isFavorite,
    toggleFavorite
  }
}
