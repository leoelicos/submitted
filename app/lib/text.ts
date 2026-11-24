/** Turn a label like "Express.js" or "Third-Party APIs" into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\.js\b/g, 'js')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const WORDS_PER_MINUTE = 220;

/** Estimated reading time in whole minutes (never less than 1). */
export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

const longDate = new Intl.DateTimeFormat('en-AU', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Australia/Sydney',
});

const shortDate = new Intl.DateTimeFormat('en-AU', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'Australia/Sydney',
});

/**
 * Same output as the original `format_date` Handlebars helper (weekday, day,
 * month, year) but pinned to a locale + zone so server and client agree and
 * hydration never mismatches.
 */
export function formatLongDate(value: Date | string): string {
  return longDate.format(new Date(value));
}

export function formatShortDate(value: Date | string): string {
  return shortDate.format(new Date(value));
}

/** ISO string for <time dateTime>. */
export function isoDate(value: Date | string): string {
  return new Date(value).toISOString();
}

/** Initials for avatar monograms: "EllaCochran" -> "EC". */
export function initials(username: string): string {
  const caps = username.match(/[A-Z]/g);
  if (caps && caps.length >= 2) return `${caps[0]}${caps[1]}`;
  return username.slice(0, 2).toUpperCase();
}

/** Deterministic hue (0-359) from a string, used for avatar tints. */
export function hueFor(input: string): number {
  let hash = 0;
  for (const char of input) hash = (hash * 31 + char.charCodeAt(0)) % 360;
  return hash;
}

/** Only allow same-origin relative redirects ("/dashboard"), never "//evil.com". */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  fallback = '/',
): string {
  if (
    typeof to !== 'string' ||
    !to.startsWith('/') ||
    to.startsWith('//') ||
    to.startsWith('/\\')
  ) {
    return fallback;
  }
  return to;
}
