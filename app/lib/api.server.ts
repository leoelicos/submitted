/** JSON helper for the read-only public API: CORS-open, cacheable, never exposes password hashes. */
export function json(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  return Response.json(body, { ...init, headers });
}
