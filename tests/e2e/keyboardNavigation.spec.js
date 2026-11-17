import { test, expect } from '@playwright/test'

const routes = [
  {
    name: 'apartment catalogue',
    path: 'mieszkania'
  },
  {
    name: 'comparison',
    path: 'porownanie'
  }
]

for (const route of routes) {
  test(`skips the header using the keyboard on ${route.name}`, async ({
    page
  }) => {
    await page.goto(route.path)

    const main = page.getByRole('main')

    await expect(main).toBeVisible()

    await page.keyboard.press('Tab')

    const skipButton = page.getByRole('button', {
      name: 'Przejdź do treści',
      exact: true
    })

    await expect(skipButton).toBeFocused()
    await expect(skipButton).toBeInViewport()

    await page.keyboard.press('Enter')

    await expect(main).toBeFocused()

    await page.keyboard.press('Tab')

    const focusIsInsideMain = await main.evaluate((element) => {
      return (
        document.activeElement !== element &&
        element.contains(document.activeElement)
      )
    })

    expect(focusIsInsideMain).toBe(true)
  })
}
