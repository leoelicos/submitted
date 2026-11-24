import { describe, expect, it } from 'vitest';
import { formatLongDate, initials, readingMinutes, safeRedirect, slugify } from '~/lib/text';

describe('slugify', () => {
  it.each([
    ['Express.js', 'expressjs'],
    ['Third-Party APIs', 'third-party-apis'],
    ['Mini-projects', 'mini-projects'],
    ['  Local Storage ', 'local-storage'],
  ])('%s -> %s', (input, expected) => expect(slugify(input)).toBe(expected));
});

describe('formatLongDate', () => {
  it('matches the original weekday/day/month/year format in Sydney time', () => {
    expect(formatLongDate('2022-05-26T12:00:00.000Z')).toBe('Thursday 26 May 2022');
  });
});

describe('readingMinutes', () => {
  it('never returns less than a minute', () => {
    expect(readingMinutes('one two')).toBe(1);
    expect(readingMinutes('word '.repeat(660))).toBe(3);
  });
});

describe('initials', () => {
  it('uses camel-case capitals when present', () => {
    expect(initials('EllaCochran')).toBe('EC');
    expect(initials('leo')).toBe('LE');
  });
});

describe('safeRedirect', () => {
  it.each([
    ['/dashboard', '/dashboard'],
    ['//evil.example', '/'],
    ['/\\evil.example', '/'],
    ['https://evil.example', '/'],
    [null, '/'],
  ])('%s -> %s', (input, expected) => expect(safeRedirect(input)).toBe(expected));
});
