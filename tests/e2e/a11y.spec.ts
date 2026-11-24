import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, signUp } from './helpers';

const publicPages = [
  ['home', '/'],
  ['filtered home', '/?category=projects&tag=expressjs'],
  ['empty search', '/?q=zzzznothing'],
  ['post', '/blog/1'],
  ['login', '/login'],
  ['accessibility statement', '/accessibility'],
  ['404', '/does-not-exist'],
] as const;

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`axe · ${scheme}`, () => {
    test.use({ colorScheme: scheme, reducedMotion: 'reduce' });

    for (const [name, path] of publicPages) {
      test(`${name} has no WCAG 2.2 AA violations`, async ({ page }) => {
        await page.goto(path);
        await expectNoAxeViolations(page);
      });
    }

    test('signed-in pages have no WCAG 2.2 AA violations', async ({ page }) => {
      await signUp(page);
      await expectNoAxeViolations(page);
      await page.goto('/dashboard/new');
      await expectNoAxeViolations(page);
      // Validation state: error summary + aria-invalid fields.
      await page.getByRole('button', { name: 'Submit post' }).click();
      await expect(page.getByRole('group', { name: 'There is a problem' })).toBeFocused();
      await expectNoAxeViolations(page);
      await page.goto('/blog/2');
      await expectNoAxeViolations(page);
    });
  });
}

test('login error state is accessible', async ({ page }) => {
  await page.goto('/login');
  const login = page.getByRole('region', { name: 'Log in' });
  await login.getByLabel('Username').fill('EllaCochran');
  await login.getByLabel('Password', { exact: true }).fill('nope-nope-nope');
  await login.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByText('Incorrect username or password, please try again.')).toBeVisible();
  await expectNoAxeViolations(page);
});
