import { test, expect } from '@playwright/test'

const getTestApartments = async (page, count) => {
  await page.goto('')

  return page.evaluate(async (limit) => {
    const { apartments } = await import('/real-estate/src/data/apartments.js')

    return apartments.slice(0, limit).map((apartment) => ({
      id: apartment.id,
      number: apartment.number
    }))
  }, count)
}

test('opens a shared comparison and preserves removal after reload', async ({
  page
}) => {
  const selectedApartments = await getTestApartments(page, 3)
  const selectedIds = selectedApartments.map((apartment) => apartment.id)

  expect(selectedIds).toHaveLength(3)

  await page.emulateMedia({ reducedMotion: 'reduce' })

  await page.goto(`porownanie?ids=${selectedIds.join(',')}`)

  const comparisonCards = page.locator('[data-comparison-id]')

  await expect(comparisonCards).toHaveCount(3)

  for (const id of selectedIds) {
    await expect(page.locator(`[data-comparison-id="${id}"]`)).toBeVisible()
  }

  const removedApartment = selectedApartments[1]

  await page
    .locator(`[data-comparison-id="${removedApartment.id}"]`)
    .getByRole('button', {
      name: `Usuń mieszkanie ${removedApartment.number} z porównania`,
      exact: true
    })
    .click()

  const remainingIds = selectedIds.filter((id) => {
    return id !== removedApartment.id
  })

  await expect(comparisonCards).toHaveCount(2)

  await expect(page).toHaveURL((url) => {
    return url.searchParams.get('ids') === remainingIds.join(',')
  })

  await page.reload()

  await expect(comparisonCards).toHaveCount(2)

  await expect(
    page.locator(`[data-comparison-id="${removedApartment.id}"]`)
  ).toHaveCount(0)

  for (const id of remainingIds) {
    await expect(page.locator(`[data-comparison-id="${id}"]`)).toBeVisible()
  }
})

test('keeps a cleared shared comparison empty after reload', async ({
  page
}) => {
  const selectedApartments = await getTestApartments(page, 2)

  const selectedIds = selectedApartments.map((apartment) => {
    return apartment.id
  })

  await page.goto(`porownanie?ids=${selectedIds.join(',')}`)

  await expect(page.locator('[data-comparison-id]')).toHaveCount(2)

  await page
    .getByRole('button', {
      name: 'Wyczyść porównanie',
      exact: true
    })
    .click()

  await expect(page).toHaveURL((url) => {
    return url.searchParams.get('ids') === ''
  })

  await page.reload()

  await expect(
    page.getByRole('heading', {
      name: 'Brak mieszkań do porównania',
      exact: true
    })
  ).toBeVisible()

  await expect(page.locator('[data-comparison-id]')).toHaveCount(0)
})
