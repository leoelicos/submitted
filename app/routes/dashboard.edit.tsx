import { data } from 'react-router';
import type { Route } from './+types/dashboard.edit';
import { PostForm } from '~/components/PostForm';
import { getDb } from '~/lib/db.server';
import { pageMeta } from '~/lib/meta';
import { parsePostForm } from '~/lib/post-form.server';
import { getPost, listTaxonomy, updatePost } from '~/lib/queries.server';
import { idParam } from '~/lib/route-utils.server';
import { redirectWithToast, requireUser, userContext } from '~/lib/session.server';

export function meta({ loaderData }: Route.MetaArgs) {
  return pageMeta(loaderData ? `Edit “${loaderData.post.title}”` : 'Edit post');
}

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const user = requireUser(context.get(userContext), request);
  const db = await getDb();
  const [post, taxonomy] = await Promise.all([getPost(db, idParam(params.id)), listTaxonomy(db)]);
  if (!post) throw data('Post not found', { status: 404 });
  if (post.author.id !== user.id) throw data('You can only edit your own posts', { status: 403 });
  return { post, ...taxonomy };
}

export async function action({ request, params, context }: Route.ActionArgs) {
  const user = requireUser(context.get(userContext), request);
  const id = idParam(params.id);
  const parsed = await parsePostForm(request);
  if (!parsed.ok) return parsed.response;
  const ok = await updatePost(await getDb(), id, user.id, parsed.input);
  if (!ok) throw data('You can only edit your own posts', { status: 403 });
  return redirectWithToast(request, `/blog/${id}`, { kind: 'success', title: 'Changes saved' });
}

export default function EditPost({ loaderData, actionData }: Route.ComponentProps) {
  const { post } = loaderData;
  const values = actionData?.values ?? {
    title: post.title,
    summary: post.summary,
    body: post.body,
    categoryId: post.category?.id ?? null,
    tagIds: post.tags.map((t) => t.id),
  };
  return (
    <div className="container">
      <header className="page-head">
        <p className="eyebrow">Dashboard</p>
        <h1>Edit post</h1>
        <p>“{post.title}”</p>
      </header>
      <PostForm
        categories={loaderData.categories}
        tags={loaderData.tags}
        values={values}
        errors={actionData?.errors}
        submitLabel="Save changes"
        pendingLabel="Saving…"
        cancelTo={`/blog/${post.id}`}
      />
    </div>
  );
}
