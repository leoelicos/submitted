import type { Route } from './+types/dashboard.new';
import { PostForm } from '~/components/PostForm';
import { getDb } from '~/lib/db.server';
import { pageMeta } from '~/lib/meta';
import { parsePostForm } from '~/lib/post-form.server';
import { createPost, listTaxonomy } from '~/lib/queries.server';
import { redirectWithToast, requireUser, userContext } from '~/lib/session.server';

export const meta = () => pageMeta('Write a new post');

export async function loader({ request, context }: Route.LoaderArgs) {
  requireUser(context.get(userContext), request);
  return listTaxonomy(await getDb());
}

export async function action({ request, context }: Route.ActionArgs) {
  const user = requireUser(context.get(userContext), request);
  const parsed = await parsePostForm(request);
  if (!parsed.ok) return parsed.response;
  const id = await createPost(await getDb(), user.id, parsed.input);
  return redirectWithToast(request, `/blog/${id}`, {
    kind: 'success',
    title: 'Submitted!',
    message: 'Your post is live on the homepage.',
    stamp: true,
  });
}

export default function NewPost({ loaderData, actionData }: Route.ComponentProps) {
  return (
    <div className="container">
      <header className="page-head">
        <p className="eyebrow">Dashboard</p>
        <h1>Write a new post</h1>
        <p>Share what you learned, what tripped you up, and what you’d tell the next cohort.</p>
      </header>
      <PostForm
        categories={loaderData.categories}
        tags={loaderData.tags}
        values={actionData?.values}
        errors={actionData?.errors}
        submitLabel="Submit post"
        pendingLabel="Submitting…"
        cancelTo="/dashboard"
      />
    </div>
  );
}
