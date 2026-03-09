import { expect, test } from '@playwright/test'

test.describe('skill add and remove', () => {
  test.describe.configure({ mode: 'serial' })

  test('add skill globally with agent selected', async ({ page }) => {
    // given
    await page.goto('/skill/find-skills')
    await expect(page.getByRole('heading', { level: 1, name: 'find-skills' })).toBeVisible()

    // when
    await page.getByRole('button', { name: /Add/ }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await dialog.locator('label', { hasText: 'OpenCode' }).click()
    await dialog.getByRole('button', { name: /^Add$/ }).click()

    // then
    await expect(dialog.getByText(/Skill added to 1 target/)).toBeVisible({ timeout: 30_000 })
    await expect(dialog).not.toBeVisible({ timeout: 5000 })
  })

  test('added skill appears in global skills', async ({ page }) => {
    // given
    await page.goto('/global')

    // then
    await expect(page.getByText('find-skills').first()).toBeVisible()
  })

  test('remove skill with confirmation', async ({ page }) => {
    // given
    await page.goto('/global')
    const skillLink = page.getByRole('link', { name: /find-skills/ }).first()
    await expect(skillLink).toBeVisible()
    const skillCard = skillLink.locator('..')

    // when: first click enters confirmation state
    await skillCard.hover()
    await skillCard.getByRole('button', { name: 'Remove skill' }).click({ force: true })
    await expect(skillCard.getByRole('button', { name: 'Click to confirm' })).toBeAttached()

    // when: second click confirms removal
    await skillCard.getByRole('button', { name: 'Click to confirm' }).click({ force: true })

    // then
    await expect(skillLink).not.toBeVisible({ timeout: 30_000 })
  })
})
