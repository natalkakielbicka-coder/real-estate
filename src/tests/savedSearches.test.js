import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { test } from 'node:test'

const STORAGE_KEY = 'real-estate-saved-searches'

const createStorage = (initialValue = null) => {
  const values = new Map()

  if (initialValue !== null) {
    values.set(STORAGE_KEY, initialValue)
  }

  return {
    getItem(key) {
      return values.get(key) ?? null
    },

    setItem(key, value) {
      values.set(key, String(value))
    }
  }
}

test('Saved searches', async (t) => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')

  const loadComposable = async (storage = createStorage()) => {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: { localStorage: storage }
    })

    const module = await import(
      `../src/composables/useSavedSearches.js?test=${randomUUID()}`
    )

    return module.useSavedSearches()
  }

  try {
    await t.test('saves applied settings without the page number', async () => {
      const storage = createStorage()
      const { saveSearch, savedSearches } = await loadComposable(storage)

      const result = saveSearch('  Kraków  ', {
        city: 'Kraków',
        rooms: '2,3',
        maxPrice: 800000,
        page: 3
      })

      assert.equal(result.success, true)
      assert.equal(savedSearches.value.length, 1)
      assert.equal(savedSearches.value[0].name, 'Kraków')

      assert.deepEqual(savedSearches.value[0].query, {
        city: 'Kraków',
        rooms: '2,3',
        maxPrice: '800000'
      })

      const stored = JSON.parse(storage.getItem(STORAGE_KEY))

      assert.deepEqual(stored, savedSearches.value)
    })

    await t.test('restores searches from storage', async () => {
      const storage = createStorage()

      const firstInstance = await loadComposable(storage)

      firstInstance.saveSearch('Z balkonem', {
        outdoorSpace: 'balcony'
      })

      const restoredInstance = await loadComposable(storage)

      assert.equal(restoredInstance.savedSearches.value.length, 1)
      assert.equal(restoredInstance.savedSearches.value[0].name, 'Z balkonem')
      assert.deepEqual(restoredInstance.savedSearches.value[0].query, {
        outdoorSpace: 'balcony'
      })
    })

    await t.test(
      'rejects duplicate criteria regardless of selection order',
      async () => {
        const { saveSearch, savedSearches } = await loadComposable()

        saveSearch('Pierwsze', { rooms: '2,3' })

        const result = saveSearch('Drugie', { rooms: '3,2' })

        assert.equal(result.success, false)
        assert.equal(savedSearches.value.length, 1)
      }
    )

    await t.test('handles invalid JSON without crashing', async () => {
      const storage = createStorage('{invalid-json')
      const { savedSearches } = await loadComposable(storage)

      assert.deepEqual(savedSearches.value, [])
    })

    await t.test('removes a search from memory and storage', async () => {
      const storage = createStorage()
      const { saveSearch, removeSearch, savedSearches } =
        await loadComposable(storage)

      saveSearch('Do usunięcia', { rooms: '2' })

      const result = removeSearch(savedSearches.value[0].id)

      assert.equal(result.success, true)
      assert.equal(savedSearches.value.length, 0)
      assert.deepEqual(JSON.parse(storage.getItem(STORAGE_KEY)), [])
    })

    await t.test('preserves existing searches when saving fails', async () => {
      const storage = createStorage()
      const { saveSearch, savedSearches } = await loadComposable(storage)

      saveSearch('Pierwsze', { rooms: '2' })

      storage.setItem = () => {
        throw new Error('Storage unavailable')
      }

      const result = saveSearch('Drugie', { rooms: '3' })

      assert.equal(result.success, false)
      assert.equal(savedSearches.value.length, 1)
      assert.equal(savedSearches.value[0].name, 'Pierwsze')
    })
  } finally {
    if (originalWindow) {
      Object.defineProperty(globalThis, 'window', originalWindow)
    } else {
      delete globalThis.window
    }
  }
})
