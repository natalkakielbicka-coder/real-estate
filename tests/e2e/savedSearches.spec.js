import { test, expect } from '@playwright/test'

test('saves a search, preserves it after reload and restores its settings', async ({
  page
}) => {
  await page.goto('mieszkania?rooms=2&view=list')

  await page
    .getByPlaceholder('Np. Kraków — 3 pokoje')
    .fill('Dwa pokoje — lista')

  await page
    .getByRole('button', {
      name: 'Zapisz wyszukiwanie',
      exact: true
    })
    .click()

  const savedSearches = page.getByRole('region', {
    name: 'Zapisane wyszukiwania'
  })

  const savedSearchLink = savedSearches.getByRole('link', {
    name: 'Dwa pokoje — lista',
    exact: true
  })

  await expect(savedSearchLink).toBeVisible()

  await page.reload()

  await expect(savedSearchLink).toBeVisible()

  await page.goto('mieszkania')

  await expect(page).toHaveURL((url) => {
    return !url.searchParams.has('rooms') && !url.searchParams.has('view')
  })

  await savedSearchLink.click()

  await expect(page).toHaveURL((url) => {
    return (
      url.searchParams.get('rooms') === '2' &&
      url.searchParams.get('view') === 'list'
    )
  })

  await expect(
    page.getByRole('button', {
      name: 'Lista',
      exact: true
    })
  ).toHaveAttribute('aria-pressed', 'true')
})

test('moves focus after deleting saved searches with the keyboard', async ({
  page
}) => {
  const searchNameInput = page.getByPlaceholder('Np. Kraków — 3 pokoje')

  const saveButton = page.getByRole('button', {
    name: 'Zapisz wyszukiwanie',
    exact: true
  })

  const savedSearches = page.getByRole('region', {
    name: 'Zapisane wyszukiwania'
  })

  await page.goto('mieszkania?rooms=2')

  await searchNameInput.fill('Dwa pokoje')
  await saveButton.click()

  await expect(
    savedSearches.getByRole('link', {
      name: 'Dwa pokoje',
      exact: true
    })
  ).toBeVisible()

  await page.goto('mieszkania?rooms=3')

  await searchNameInput.fill('Trzy pokoje')
  await saveButton.click()

  await expect(savedSearches.getByRole('link')).toHaveCount(2)

  const removeThreeRooms = savedSearches.getByRole('button', {
    name: 'Usuń wyszukiwanie: Trzy pokoje',
    exact: true
  })

  await removeThreeRooms.focus()
  await removeThreeRooms.press('Enter')

  const remainingLink = savedSearches.getByRole('link', {
    name: 'Dwa pokoje',
    exact: true
  })

  await expect(remainingLink).toBeFocused()
  await expect(savedSearches.getByRole('link')).toHaveCount(1)

  const removeTwoRooms = savedSearches.getByRole('button', {
    name: 'Usuń wyszukiwanie: Dwa pokoje',
    exact: true
  })

  await removeTwoRooms.focus()
  await removeTwoRooms.press('Enter')

  await expect(savedSearches).toHaveCount(0)
  await expect(searchNameInput).toBeFocused()

  await page.reload()

  await expect(savedSearches).toHaveCount(0)
})
