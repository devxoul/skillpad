import { expect, test } from '@playwright/test'

test('concurrent skill listing does not produce link errors', async ({ page }) => {
  // given: set package manager to bunx (triggers bunx temp dir usage)
  await page.goto('/')
  await page.evaluate(() => {
    const storageKey = 'skillpad-store:skillpad.json'
    const data = JSON.parse(localStorage.getItem(storageKey) || '{}')
    data.preferences = { packageManager: 'bunx' }
    localStorage.setItem(storageKey, JSON.stringify(data))
  })

  // when: navigate to global skills (fires listSkills)
  await page.getByRole('link', { name: 'Global Skills' }).click()
  await expect(page).toHaveURL('/global')

  // then: page loads without EEXIST or link error
  await expect(page.getByRole('heading', { name: 'Global Skills', level: 1 })).toBeVisible()
  await expect(page.getByText(/EEXIST/)).not.toBeVisible()
  await expect(page.getByText(/Failed to link/)).not.toBeVisible()
})
