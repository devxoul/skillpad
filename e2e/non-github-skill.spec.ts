import { expect, test } from '@playwright/test'

test.describe('non-GitHub skill source', () => {
  test('detail page resolves non-GitHub source and shows View Source button', async ({ page }) => {
    // given - navigate to a non-GitHub skill (sentry/dev/sentry-cli)
    await page.goto('/skill/sentry/dev/sentry-cli')

    // then - skill name renders
    await expect(page.getByRole('heading', { level: 2, name: 'sentry-cli' })).toBeVisible({
      timeout: 30_000,
    })

    // then - should show "View Source" button (not GitHub) since it's a well-known source
    await expect(page.getByRole('button', { name: /View Source/ })).toBeVisible({ timeout: 30_000 })
  })

  test('README loads for non-GitHub skill via well-known discovery', async ({ page }) => {
    // given
    await page.goto('/skill/sentry/dev/sentry-cli')
    await expect(page.getByRole('heading', { level: 2, name: 'sentry-cli' })).toBeVisible({
      timeout: 30_000,
    })

    // then - prose content (rendered SKILL.md) should be visible
    await expect(page.locator('.prose')).toBeVisible({ timeout: 30_000 })
  })

  test('add dialog uses resolved source for non-GitHub skill', async ({ page }) => {
    // given
    await page.goto('/skill/sentry/dev/sentry-cli')
    await expect(page.getByRole('heading', { level: 2, name: 'sentry-cli' })).toBeVisible({
      timeout: 30_000,
    })

    // when
    await page.getByRole('button', { name: /Add/ }).first().click()

    // then - dialog opens
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { name: /Add sentry-cli/i })).toBeVisible()
  })
})

test.describe('non-GitHub skill install lifecycle', () => {
  test.describe.configure({ mode: 'serial' })

  test('add non-GitHub skill globally', async ({ page }) => {
    // given
    await page.goto('/skill/sentry/dev/sentry-cli')
    await expect(page.getByRole('heading', { level: 2, name: 'sentry-cli' })).toBeVisible({
      timeout: 30_000,
    })

    // when
    await page.getByRole('button', { name: /Add/ }).first().click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await dialog.locator('label', { hasText: 'OpenCode' }).click()
    await dialog.getByRole('button', { name: /^Add$/ }).click()

    // then
    await expect(dialog.getByText(/Skill added to 1 target/)).toBeVisible({ timeout: 60_000 })
    await expect(dialog).not.toBeVisible({ timeout: 5000 })
  })

  test('non-GitHub skill appears in global skills', async ({ page }) => {
    // given
    await page.goto('/global')

    // then
    await expect(page.getByText('sentry-cli').first()).toBeVisible({ timeout: 30_000 })
  })

  test('remove non-GitHub skill', async ({ page }) => {
    // given
    await page.goto('/global')
    const skillItem = page.getByRole('link', { name: /sentry-cli/ }).first()
    await expect(skillItem).toBeVisible({ timeout: 30_000 })

    // when: first click enters confirmation state
    await skillItem.hover()
    await skillItem.getByRole('button', { name: 'Remove skill' }).click({ force: true })
    await expect(skillItem.getByRole('button', { name: 'Click to confirm' })).toBeAttached()

    // when: second click confirms removal
    await skillItem.getByRole('button', { name: 'Click to confirm' }).click({ force: true })

    // then
    await expect(skillItem).not.toBeVisible({ timeout: 30_000 })
  })
})
