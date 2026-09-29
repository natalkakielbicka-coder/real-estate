import { ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'recently-viewed-apartment-ids'
const MAX_RECENT_APARTMENTS = 7

export const useRecentlyViewedStore = defineStore('recentlyViewed', () => {
  const recentlyViewedApartmentIds = ref([])

  const loadRecentlyViewed = () => {
    try {
      const savedApartmentIds = localStorage.getItem(STORAGE_KEY)

      if (!savedApartmentIds) {
        return
      }

      const parsedApartmentIds = JSON.parse(savedApartmentIds)

      if (!Array.isArray(parsedApartmentIds)) {
        return
      }

      recentlyViewedApartmentIds.value = [
        ...new Set(
          parsedApartmentIds.filter((apartmentId) => {
            return Number.isInteger(apartmentId)
          })
        )
      ].slice(0, MAX_RECENT_APARTMENTS)
    } catch {
      recentlyViewedApartmentIds.value = []
    }
  }

  const addRecentlyViewedApartment = (apartmentId) => {
    const nextApartmentIds = [
      apartmentId,
      ...recentlyViewedApartmentIds.value.filter((id) => {
        return id !== apartmentId
      })
    ].slice(0, MAX_RECENT_APARTMENTS)

    recentlyViewedApartmentIds.value = nextApartmentIds

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextApartmentIds))
    } catch {
      // Historia nadal działa do czasu odświeżenia strony.
    }
  }

  loadRecentlyViewed()

  return {
    recentlyViewedApartmentIds,
    addRecentlyViewedApartment
  }
})
