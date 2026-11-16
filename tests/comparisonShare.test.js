import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  getSharedComparisonIds,
  createComparisonLocation
} from '../src/utils/comparisonShare.js'

const apartments = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]

test('reads apartment IDs and preserves their order', () => {
  const result = getSharedComparisonIds('3,1,2', apartments)

  assert.deepEqual(result, [3, 1, 2])
})

test('removes duplicates and ignores invalid or unknown IDs', () => {
  const result = getSharedComparisonIds('1,1,abc,-2,1.5,999,2', apartments)

  assert.deepEqual(result, [1, 2])
})

test('limits the comparison to three valid apartments', () => {
  const result = getSharedComparisonIds('999,4,2,1,3', apartments)

  assert.deepEqual(result, [4, 2, 1])
})

test('supports repeated query parameters', () => {
  const result = getSharedComparisonIds(['1,2', '2,3'], apartments)

  assert.deepEqual(result, [1, 2, 3])
})

test('handles missing and empty query values', () => {
  for (const value of [undefined, null, '', ' , ', []]) {
    assert.deepEqual(getSharedComparisonIds(value, apartments), [])
  }
})

test('creates a comparison location using valid unique IDs', () => {
  const result = createComparisonLocation([3, 3, 999, 1, 2, 4], apartments)

  assert.deepEqual(result, {
    name: 'comparison',
    query: {
      ids: '3,1,2'
    }
  })
})

test('creates a location without IDs when the selection is empty', () => {
  const result = createComparisonLocation([], apartments)

  assert.deepEqual(result, {
    name: 'comparison',
    query: {}
  })
})

test('preserves IDs when creating and reading a shared location', () => {
  const location = createComparisonLocation([4, 1, 2], apartments)

  const restoredIds = getSharedComparisonIds(location.query.ids, apartments)

  assert.deepEqual(restoredIds, [4, 1, 2])
})
