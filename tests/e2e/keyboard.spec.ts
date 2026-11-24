import { expect, test } from '@playwright/test';
import { uniqueName } from './helpers';

test('skip link is the first tab stop and jumps to main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('client-side navigation moves focus to the new page heading', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Project 2, what to do?' }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Project 2, what to do?' }),
  ).toBeFocused();
});

test('theme switch is a keyboard-operable radio group that persists', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const group = page.getByRole('group', { name: 'Colour theme' });
  const saved = page.waitForResponse((r) => r.url().includes('/theme') && r.ok());
  await group.getByRole('radio', { name: 'Dark' }).check();
  await saved;
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await group.getByRole('radio', { name: 'Dark' }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark');
});

test('password visibility toggle exposes state', async ({ page }) => {
  await page.goto('/login');
  const region = page.getByRole('region', { name: 'Log in' });
  const toggle = region.getByRole('button', { name: 'Show password' });
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  await expect(region.getByRole('button', { name: 'Hide password' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(region.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'text');
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('decorative animation is disabled', async ({ page }) => {
    await page.goto('/');
    const duration = await page
      .getByRole('heading', { level: 1 })
      .evaluate((el) => getComputedStyle(el).animationDuration);
    expect(['0s', '1e-05s', '0.00001s']).toContain(duration);
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('sign up and posting still work (progressive enhancement)', async ({ page }) => {
    const username = uniqueName('nojs');
    await page.goto('/login');
    const signup = page.getByRole('region', { name: 'Sign up' });
    await signup.getByLabel('New username').fill(username);
    await signup.getByLabel('New password', { exact: true }).fill('correct horse battery');
    await signup.getByRole('button', { name: 'Sign up' }).click();
    await expect(
      page.getByRole('heading', { level: 1, name: `Welcome, ${username}!` }),
    ).toBeVisible();
    await page.goto('/dashboard/new');
    await page.getByLabel('Title').fill('Written with JS off');
    await page.getByLabel('Summary').fill('It just works');
    await page.getByLabel('Post').fill('Forms are forms.');
    await page.getByRole('button', { name: 'Submit post' }).click();
    await expect(
      page.getByRole('heading', { level: 1, name: 'Written with JS off' }),
    ).toBeVisible();
  });
});

test('mobile layout has no horizontal scroll @mobile', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  await page.goto('/blog/3');
  const overflowPost = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflowPost).toBeLessThanOrEqual(0);
});
