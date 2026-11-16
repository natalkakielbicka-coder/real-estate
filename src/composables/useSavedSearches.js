import { readonly, ref } from 'vue'

const STORAGE_KEY = 'real-estate-saved-searches'
const MAX_SAVED_SEARCHES = 10

const allowedQueryKeys = [
  'city',
  'rooms',
  'floors',
  'status',
  'outdoorSpace',
  'parking',
  'storage',
  'minPrice',
  'maxPrice',
  'floor',
  'sort',
  'view'
]

const savedSearches = ref([])
let isLoaded = false

const normalizeQuery = (query) => {
  const normalized = {}

  for (const key of allowedQueryKeys) {
    const value = query[key]

    if (typeof value !== 'string' && typeof value !== 'number') {
      continue
    }

    if (typeof value === 'number' && !Number.isFinite(value)) {
      continue
    }

    if (String(value).trim() !== '') {
      normalized[key] = String(value)
    }
  }

  return normalized
}

const isValidSearch = (search) => {
  return (
    search !== null &&
    typeof search === 'object' &&
    typeof search.id === 'string' &&
    search.id.length > 0 &&
    typeof search.name === 'string' &&
    search.name.trim().length > 0 &&
    search.name.trim().length <= 60 &&
    search.query !== null &&
    typeof search.query === 'object' &&
    !Array.isArray(search.query)
  )
}

const loadSearches = () => {
  if (isLoaded || typeof window === 'undefined') {
    return
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY)
    const parsedValue = storedValue ? JSON.parse(storedValue) : []

    if (!Array.isArray(parsedValue)) {
      isLoaded = true
      return
    }

    const ids = new Set()

    savedSearches.value = parsedValue
      .filter(isValidSearch)
      .filter((search) => {
        if (ids.has(search.id)) {
          return false
        }

        ids.add(search.id)
        return true
      })
      .slice(0, MAX_SAVED_SEARCHES)
      .map((search) => ({
        id: search.id,
        name: search.name.trim(),
        query: normalizeQuery(search.query)
      }))

    isLoaded = true
  } catch {
    savedSearches.value = []
  }
}

const persistSearches = (nextSearches) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSearches))

    savedSearches.value = nextSearches

    return { success: true }
  } catch {
    return {
      success: false,
      message: 'Nie udało się zapisać zmian w przeglądarce.'
    }
  }
}

export const useSavedSearches = () => {
  loadSearches()

  const saveSearch = (name, query) => {
    const trimmedName = typeof name === 'string' ? name.trim() : ''

    if (!trimmedName) {
      return {
        success: false,
        message: 'Podaj nazwę wyszukiwania.'
      }
    }

    if (trimmedName.length > 60) {
      return {
        success: false,
        message: 'Nazwa może mieć maksymalnie 60 znaków.'
      }
    }

    const nameExists = savedSearches.value.some((search) => {
      return (
        search.name.toLocaleLowerCase('pl-PL') ===
        trimmedName.toLocaleLowerCase('pl-PL')
      )
    })

    if (nameExists) {
      return {
        success: false,
        message: 'Wyszukiwanie o tej nazwie już istnieje.'
      }
    }

    if (savedSearches.value.length >= MAX_SAVED_SEARCHES) {
      return {
        success: false,
        message: `Możesz zapisać maksymalnie ${MAX_SAVED_SEARCHES} wyszukiwań.`
      }
    }

    if (!query || typeof query !== 'object' || Array.isArray(query)) {
      return {
        success: false,
        message: 'Nieprawidłowe kryteria wyszukiwania.'
      }
    }

    const search = {
      id: crypto.randomUUID(),
      name: trimmedName,
      query: normalizeQuery(query)
    }

    return persistSearches([search, ...savedSearches.value])
  }

  const removeSearch = (id) => {
    const nextSearches = savedSearches.value.filter((search) => {
      return search.id !== id
    })

    return persistSearches(nextSearches)
  }

  return {
    savedSearches: readonly(savedSearches),
    saveSearch,
    removeSearch
  }
}
