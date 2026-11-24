import { redirect } from 'react-router';
import type { Route } from './+types/logout';
import { redirectWithToast } from '~/lib/session.server';

export const loader = () => redirect('/');

export async function action({ request }: Route.ActionArgs) {
  return redirectWithToast(
    request,
    '/',
    { kind: 'info', title: 'Logged out', message: 'See you next sprint.' },
    null,
  );
}
