import { data } from 'react-router';

/** Parse a positive integer route param or 404. */
export function idParam(value: string | undefined): number {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) throw data('Not found', { status: 404 });
  return id;
}
