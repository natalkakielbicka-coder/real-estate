const MAX_SHARED_APARTMENTS = 3

const normalizeApartmentIds = (ids, apartments) => {
  const availableIds = new Set(apartments.map((apartment) => apartment.id))

  return [...new Set(ids)]
    .filter((id) => {
      return Number.isSafeInteger(id) && availableIds.has(id)
    })
    .slice(0, MAX_SHARED_APARTMENTS)
}

export const getSharedComparisonIds = (queryValue, apartments) => {
  const queryValues = Array.isArray(queryValue) ? queryValue : [queryValue]

  const ids = queryValues
    .filter((value) => typeof value === 'string')
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter((value) => /^\d+$/.test(value))
    .map(Number)

  return normalizeApartmentIds(ids, apartments)
}

export const createComparisonLocation = (ids, apartments) => {
  const validIds = normalizeApartmentIds(ids, apartments)

  return {
    name: 'comparison',
    query: validIds.length > 0 ? { ids: validIds.join(',') } : {}
  }
}
