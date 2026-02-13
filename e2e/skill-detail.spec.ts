import { expect, test } from '@playwright/test'
import { mockApiRoutes } from './helpers'

test.beforeEach(async ({ page }) => {
  await mockApiRoutes(page)
})

test('detail page loads with skill info', async ({ page }) => {
  // given
  await page.goto('/skill/git-master')

  // then
  await expect(page.getByRole('heading', { level: 1, name: 'git-master' })).toBeVisible()
  await expect(page.getByText('1.3K installs')).toBeVisible()
  await expect(page.getByRole('button', { name: /opencode\/skills/ })).toBeVisible()
})

test('README content renders', async ({ page }) => {
  // given
  await page.goto('/skill/git-master')

  // then
  await expect(page.getByText('Example Skill')).toBeVisible()
  await expect(page.getByText('A sample skill for testing purposes.')).toBeVisible()
})

test('back button navigates back', async ({ page }) => {
  // given
  await page.goto('/')
  await page.getByRole('link', { name: /git-master/ }).click()
  await expect(page).toHaveURL(/\/skill\//)

  // when
  await page.getByRole('button', { name: 'Go back' }).click()

  // then
  await expect(page).toHaveURL('/')
})

test('not found state', async ({ page }) => {
  // given
  await page.goto('/skill/nonexistent-skill')

  // then
  await expect(page.getByText('Could not find skill "nonexistent-skill"')).toBeVisible()
})
