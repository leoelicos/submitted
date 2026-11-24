import { ViewTransition } from 'react';
import {
  data,
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';
import type { Route } from './+types/root';
import frauncesUrl from '@fontsource-variable/fraunces/files/fraunces-latin-soft-normal.woff2?url';
import interUrl from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url';
import { RouteFocus } from './components/RouteFocus';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { Toaster } from './components/Toaster';
import { getDb, isDemoDatabase } from './lib/db.server';
import { findUserById } from './lib/queries.server';
import { commit, getSession, getTheme, userContext } from './lib/session.server';
import './styles/app.css';

const securityHeaders: Route.MiddlewareFunction = async (_args, next) => {
  const response = await next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
};

/** Resolve the signed-in user once per request; every loader/action reads it from context. */
const loadUser: Route.MiddlewareFunction = async ({ request, context }) => {
  const session = await getSession(request);
  const userId = session.get('userId');
  const user = userId ? await findUserById(await getDb(), userId) : null;
  context.set(userContext, user);
};

export const middleware: Route.MiddlewareFunction[] = [securityHeaders, loadUser];

export async function loader({ request, context }: Route.LoaderArgs) {
  const session = await getSession(request);
  const toast = session.get('toast') ?? null;
  return data(
    {
      user: context.get(userContext),
      theme: await getTheme(request),
      toast,
      demo: isDemoDatabase(),
    },
    toast ? { headers: await commit(session) } : undefined,
  );
}

export const links: Route.LinksFunction = () => [
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  { rel: 'manifest', href: '/site.webmanifest' },
  { rel: 'preload', href: frauncesUrl, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
  { rel: 'preload', href: interUrl, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const root = useRouteLoaderData<typeof loader>('root');
  const theme = root?.theme ?? 'system';
  return (
    <html lang="en-AU" data-theme={theme === 'system' ? undefined : theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="color-scheme" content={theme === 'system' ? 'light dark' : theme} />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f7f4ec" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0b0d0c" />
        <Meta />
        <Links />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <SiteHeader user={loaderData.user} theme={loaderData.theme} />
      <ViewTransition>
        <main id="main" tabIndex={-1}>
          <Outlet />
        </main>
      </ViewTransition>
      <SiteFooter />
      <Toaster toast={loaderData.toast} />
      <RouteFocus />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const root = useRouteLoaderData<typeof loader>('root');
  let status = 500;
  let heading = 'Something broke';
  let details = 'An unexpected error occurred. Try again, or head back to the homepage.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    if (error.status === 404) {
      heading = 'Not submitted';
      details = "We couldn't find that page. It may have been deleted, or the link is wrong.";
    } else {
      details = error.statusText || details;
    }
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <>
      <title>{`${status} ${heading} · Submitted!`}</title>
      <SiteHeader user={root?.user ?? null} theme={root?.theme ?? 'system'} />
      <main id="main" tabIndex={-1}>
        <div className="container error-page">
          <span className="stamp" aria-hidden="true">
            {status}
          </span>
          <h1 className="page-head">{heading}</h1>
          <p>{details}</p>
          <Link className="button" to="/">
            Back to the homepage
          </Link>
          {stack ? (
            <pre>
              <code>{stack}</code>
            </pre>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
