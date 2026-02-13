import { expect, test } from '@playwright/test'
import { mockApiRoutes } from './helpers'

test.beforeEach(async ({ page }) => {
  await mockApiRoutes(page)
})

test('dialog opens from detail page', async ({ page }) => {
  // given
  await page.goto('/skill/git-master')

  // when
  await page.getByRole('button', { name: /Add/ }).click()

  // then
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('heading', { name: /Add git-master/i })).toBeVisible()
})

test('agent checkboxes render', async ({ page }) => {
  // given
  await page.goto('/skill/git-master')
  await page.getByRole('button', { name: /Add/ }).click()

  // then - check for several agent names from AGENTS data
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('span', { hasText: 'OpenCode' }).first()).toBeVisible()
  await expect(dialog.locator('span', { hasText: 'Claude Code' }).first()).toBeVisible()
  await expect(dialog.locator('span', { hasText: 'Cursor' }).first()).toBeVisible()
  await expect(dialog.locator('span', { hasText: 'Cline' }).first()).toBeVisible()
  await expect(dialog.locator('span', { hasText: 'Windsurf' }).first()).toBeVisible()
})

test('add button disabled without selection', async ({ page }) => {
  // given
  await page.goto('/skill/git-master')
  await page.getByRole('button', { name: /Add/ }).click()

  // when - dialog opens with default state (Global checked, no agents selected)
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()

  // Uncheck Global to ensure no scope is selected
  await dialog.getByText('Global').click()

  // then - Add submit button should be disabled (no agents + no scope)
  const addButton = dialog.getByRole('button', { name: /^Add$/ })
  await expect(addButton).toBeDisabled()
})

test('dialog can be cancelled', async ({ page }) => {
  // given
  await page.goto('/skill/git-master')
  await page.getByRole('button', { name: /Add/ }).click()
  await expect(page.getByRole('dialog')).toBeVisible()

  // when
  await page.getByRole('button', { name: /Cancel/ }).click()

  // then
  await expect(page.getByRole('dialog')).not.toBeVisible()
})
