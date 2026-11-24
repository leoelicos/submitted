import { json } from '~/lib/api.server';
import { getDb } from '~/lib/db.server';
import { listTaxonomy } from '~/lib/queries.server';

export async function loader() {
  return json((await listTaxonomy(await getDb())).categories);
}
