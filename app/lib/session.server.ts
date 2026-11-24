import { randomUUID } from 'node:crypto';
import { createContext, createCookie, createCookieSessionStorage, redirect } from 'react-router';
import './env.server';

export type ToastKind = 'success' | 'info' | 'error';
export interface Toast {
  kind: ToastKind;
  title: string;
  message?: string;
  /** Show the big rubber "SUBMITTED!" stamp animation. */
  stamp?: boolean;
}

interface SessionData {
  userId: number;
}
interface FlashData {
  toast: Toast;
}

function sessionSecret(): string {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    throw new Error('SESSION_SECRET must be set when running against a real database.');
  }
  // Demo / dev: a per-process secret. Sessions reset on restart, which is fine.
  globalThis.__submittedDevSecret ??= randomUUID();
  return globalThis.__submittedDevSecret;
}

declare global {
  var __submittedDevSecret: string | undefined;
}

export const sessionStorage = createCookieSessionStorage<SessionData, FlashData>({
  cookie: {
    name: '__submitted',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // one day, same as the original express-session cookie
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret()],
  },
});

export const getSession = (request: Request) =>
  sessionStorage.getSession(request.headers.get('Cookie'));

export async function commit(session: Awaited<ReturnType<typeof getSession>>) {
  return { 'Set-Cookie': await sessionStorage.commitSession(session) };
}

/** Redirect and show a toast on the next page. */
export async function redirectWithToast(
  request: Request,
  to: string,
  toast: Toast,
  userId?: number | null,
) {
  const session = await getSession(request);
  if (userId === null) session.unset('userId');
  else if (userId !== undefined) session.set('userId', userId);
  session.flash('toast', toast);
  return redirect(to, { headers: await commit(session) });
}

export interface SessionUser {
  id: number;
  username: string;
}

/** Populated once per request by the root middleware. */
export const userContext = createContext<SessionUser | null>(null);

export function requireUser(user: SessionUser | null, request: Request): SessionUser {
  if (user) return user;
  const url = new URL(request.url);
  const params = new URLSearchParams({ redirectTo: url.pathname + url.search });
  throw redirect(`/login?${params}`);
}

export type Theme = 'light' | 'dark' | 'system';
export const themeCookie = createCookie('theme', {
  path: '/',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 365,
});

export async function getTheme(request: Request): Promise<Theme> {
  const value: unknown = await themeCookie.parse(request.headers.get('Cookie'));
  return value === 'light' || value === 'dark' ? value : 'system';
}
