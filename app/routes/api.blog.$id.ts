import type { Route } from './+types/api.blog.$id';
import { json } from '~/lib/api.server';
import { getDb } from '~/lib/db.server';
import { getPost } from '~/lib/queries.server';

export async function loader({ params }: Route.LoaderArgs) {
  const id = Number(params.id);
  const post = Number.isSafeInteger(id) && id > 0 ? await getPost(await getDb(), id) : null;
  return post ? json(post) : json({ message: 'No blog found with this id!' }, { status: 404 });
}
