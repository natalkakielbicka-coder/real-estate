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
