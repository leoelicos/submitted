import { AxeBuilder } from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

export const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

export async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const summary = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    targets: v.nodes.map((n) => n.target.join(' ')).slice(0, 5),
  }));
  expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
}

let counter = 0;
export function uniqueName(prefix = 'e2e') {
  counter += 1;
  return `${prefix}${Date.now().toString(36)}${counter}`.slice(0, 32);
}

export async function signUp(page: Page, username = uniqueName()) {
  await page.goto('/login');
  const form = page.getByRole('region', { name: 'Sign up' });
  await form.getByLabel('New username').fill(username);
  await form.getByLabel('New password', { exact: true }).fill('correct horse battery');
  await form.getByRole('button', { name: 'Sign up' }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: `Welcome, ${username}!` }),
  ).toBeVisible();
  return username;
}
