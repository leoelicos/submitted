import { expect, test } from '@playwright/test';
import { signUp, uniqueName } from './helpers';

test('homepage lists the original posts and filters them', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Submitted!' })).toBeVisible();
  await expect(page.getByRole('list', { name: 'Latest posts' }).getByRole('article')).toHaveCount(
    15,
  );

  await page
    .getByRole('navigation', { name: 'Categories' })
    .getByRole('link', { name: /Projects/ })
    .click();
  await expect(page).toHaveURL(/category=projects/);
  await expect(page.getByRole('status').filter({ hasText: '2 posts in Projects' })).toBeVisible();

  await page.getByLabel('Search posts').fill('flex box');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page).toHaveURL(/q=flex/);
  await page.getByRole('link', { name: 'Clear filters' }).first().click();
  await expect(page.getByRole('list', { name: 'Latest posts' }).getByRole('article')).toHaveCount(
    15,
  );
});

test('posts are public; commenting asks you to log in and returns you', async ({ page }) => {
  await page.goto('/blog/1');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Project 2, what to do?' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Log in or sign up' }).click();
  await expect(page).toHaveURL(/redirectTo=%2Fblog%2F1/);
  const login = page.getByRole('region', { name: 'Log in' });
  await login.getByLabel('Username').fill('EllaCochran');
  await login.getByLabel('Password', { exact: true }).fill('password12345');
  await login.getByRole('button', { name: 'Log in' }).click();
  await expect(page).toHaveURL(/\/blog\/1/);
  await expect(page.getByLabel('Comment as EllaCochran')).toBeVisible();
});

test('full author journey: sign up, write, comment, edit, delete', async ({ page }) => {
  const username = await signUp(page, uniqueName('author'));
  await expect(page.getByText('No blogs yet.')).toBeVisible();

  await page.getByRole('link', { name: 'Write your first post' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Write a new post' })).toBeFocused();

  // Server-side validation with focus on the summary and links to fields.
  await page.getByRole('button', { name: 'Submit post' }).click();
  const summary = page.getByRole('group', { name: 'There is a problem' });
  await expect(summary).toBeFocused();
  await summary.getByRole('link', { name: 'Title is required.' }).click();
  await expect(page.getByLabel('Title')).toBeFocused();
  await expect(page.getByLabel('Title')).toHaveAttribute('aria-invalid', 'true');

  await page.getByLabel('Title').fill('Accessibility, not an afterthought!');
  await page.getByLabel('Summary').fill('Why WCAG 2.2 belongs in week one');
  await page.getByLabel('Post').fill('Semantic HTML first.\n\nThen test with a keyboard.');
  await page.getByLabel(/Category/).selectOption({ label: 'Homework' });
  await page.getByRole('checkbox', { name: 'HTML', exact: true }).check();
  await page.getByRole('checkbox', { name: 'CSS', exact: true }).check();
  await page.getByRole('button', { name: 'Submit post' }).click();

  await expect(
    page.getByRole('heading', { level: 1, name: 'Accessibility, not an afterthought!' }),
  ).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: 'Submitted!' })).toBeVisible();
  await expect(page.locator('.article__body p')).toHaveCount(2);
  await expect(page.getByRole('list', { name: 'Tags' })).toContainText('CSS');

  await page.getByLabel(`Comment as ${username}`).fill('Commenting on my own post');
  await page.getByRole('button', { name: 'Post comment' }).click();
  await expect(page.getByRole('article', { name: `Comment by ${username}` })).toContainText(
    'Commenting on my own post',
  );

  await page.getByRole('link', { name: /^Edit/ }).click();
  await page.getByLabel('Title').fill('Accessibility, always!');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Accessibility, always!' }),
  ).toBeVisible();
  await expect(page.getByText(/^Edited/)).toBeVisible();

  await page.getByRole('button', { name: /^Delete “Accessibility, always!”/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Delete “Accessibility, always!”?' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await page.getByRole('button', { name: /^Delete “Accessibility, always!”/ }).click();
  await dialog.getByRole('button', { name: 'Yes, delete' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText('No blogs yet.')).toBeVisible();
});

test('other users cannot edit your post', async ({ page }) => {
  await signUp(page);
  const response = await page.goto('/dashboard/1/edit');
  expect(response?.status()).toBe(403);
});

test('logout clears the session', async ({ page }) => {
  await signUp(page);
  await page.getByRole('button', { name: /Log out/ }).click();
  await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login\?redirectTo=%2Fdashboard/);
});

test('read-only JSON API keeps the original shape without leaking secrets', async ({ request }) => {
  const posts = await (await request.get('/api/blog')).json();
  expect(posts).toHaveLength(15);
  expect(JSON.stringify(posts)).not.toContain('passwordHash');
  const missing = await request.get('/api/blog/9999');
  expect(missing.status()).toBe(404);
});
