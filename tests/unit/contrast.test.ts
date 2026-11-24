import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Guards the palette in app/styles/tokens.css: every pair the UI actually
 * renders is checked in BOTH light and dark schemes against WCAG 2.2 ratios.
 */
const css = readFileSync(new URL('../../app/styles/tokens.css', import.meta.url), 'utf8');
const tokens = new Map<string, [string, string]>();
for (const match of css.matchAll(
  /--([\w-]+):\s*light-dark\((#[0-9a-f]{6}),\s*(#[0-9a-f]{6})\)/gi,
)) {
  tokens.set(match[1]!, [match[2]!, match[3]!]);
}

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function ratio(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].toSorted((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

const AAA = 7;
const AA = 4.5;
const UI = 3;

const pairs: [fg: string, bg: string, min: number][] = [
  ['ink', 'paper', AAA],
  ['ink', 'surface', AAA],
  ['ink', 'surface-2', AAA],
  ['muted', 'paper', AAA],
  ['muted', 'surface', AAA],
  ['muted', 'surface-2', AA],
  ['brand', 'paper', AA],
  ['brand', 'surface', AA],
  ['brand', 'brand-soft', AA],
  ['brand-ink', 'brand', AA],
  ['ink', 'brand-soft', AAA],
  ['stamp', 'paper', AA],
  ['stamp', 'surface', AA],
  ['ink', 'stamp-soft', AAA],
  ['ink', 'highlight', AAA],
  ['focus', 'paper', UI],
  ['focus', 'surface', UI],
  ['line-strong', 'surface', UI],
  ['line-strong', 'paper', UI],
];

describe('palette contrast (WCAG 2.2)', () => {
  it('parses the tokens file', () => expect(tokens.size).toBeGreaterThanOrEqual(15));

  for (const [fg, bg, min] of pairs) {
    for (const [scheme, index] of [
      ['light', 0],
      ['dark', 1],
    ] as const) {
      it(`${fg} on ${bg} (${scheme}) >= ${min}:1`, () => {
        const a = tokens.get(fg)?.[index];
        const b = tokens.get(bg)?.[index];
        expect(a, `missing --${fg}`).toBeDefined();
        expect(b, `missing --${bg}`).toBeDefined();
        expect(ratio(a!, b!)).toBeGreaterThanOrEqual(min);
      });
    }
  }
});
