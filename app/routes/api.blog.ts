import type { Route } from './+types/api.blog';
import { json } from '~/lib/api.server';
import { getDb } from '~/lib/db.server';
import { listPosts } from '~/lib/queries.server';

/** GET /api/blog?category=&tag=&q= : the original endpoint, now read-only and filterable. */
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const posts = await listPosts(await getDb(), {
    category: url.searchParams.get('category') || undefined,
    tag: url.searchParams.get('tag') || undefined,
    q: url.searchParams.get('q') || undefined,
  });
  return json(posts);
}
