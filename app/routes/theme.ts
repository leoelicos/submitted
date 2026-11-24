import { data, redirect } from 'react-router';
import type { Route } from './+types/theme';
import { themeCookie } from '~/lib/session.server';
import { safeRedirect } from '~/lib/text';

export const loader = () => redirect('/');

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const value = form.get('theme');
  const theme = value === 'light' || value === 'dark' ? value : 'system';
  const headers = { 'Set-Cookie': await themeCookie.serialize(theme) };
  // No-JS form posts land here directly: bounce back to where they came from.
  const referer = request.headers.get('Referer');
  if (request.headers.get('Accept')?.includes('text/html') && referer) {
    const back = new URL(referer);
    throw redirect(safeRedirect(back.pathname + back.search), { headers });
  }
  return data({ theme }, { headers });
}
