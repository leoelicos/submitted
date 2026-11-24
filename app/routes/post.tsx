import { ViewTransition } from 'react';
import { data, Form, Link, useNavigation } from 'react-router';
import type { Route } from './+types/post';
import { Avatar, Byline } from '~/components/Byline';
import { ConfirmDelete } from '~/components/ConfirmDelete';
import { ErrorSummary, Field, SubmitButton } from '~/components/forms';
import { PencilIcon } from '~/components/icons';
import { TagList } from '~/components/PostCard';
import { getDb } from '~/lib/db.server';
import { pageMeta } from '~/lib/meta';
import { addComment, deleteComment, deletePost, getPost } from '~/lib/queries.server';
import { idParam } from '~/lib/route-utils.server';
import { redirectWithToast, requireUser, userContext } from '~/lib/session.server';
import { formatLongDate, isoDate } from '~/lib/text';
import { commentSchema, LIMITS, parseWith } from '~/lib/validation';

export function meta({ loaderData }: Route.MetaArgs) {
  return loaderData
    ? pageMeta(loaderData.post.title, loaderData.post.summary)
    : pageMeta('Post not found');
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const post = await getPost(await getDb(), idParam(params.id));
  if (!post) throw data('Post not found', { status: 404 });
  return { post, user: context.get(userContext) };
}

export async function action({ request, params, context }: Route.ActionArgs) {
  const user = requireUser(context.get(userContext), request);
  const postId = idParam(params.id);
  const db = await getDb();
  const form = await request.formData();
  const intent = form.get('intent');

  if (intent === 'delete') {
    const deleted = await deletePost(db, postId, user.id);
    if (!deleted) throw data('You can only delete your own posts', { status: 403 });
    return redirectWithToast(request, '/dashboard', {
      kind: 'success',
      title: 'Post deleted',
      message: `“${deleted.title}” is gone.`,
    });
  }

  if (intent === 'delete-comment') {
    const ok = await deleteComment(db, Number(form.get('commentId')), user.id);
    if (!ok) throw data('You can only delete your own comments', { status: 403 });
    return redirectWithToast(request, `/blog/${postId}#comments`, {
      kind: 'info',
      title: 'Comment deleted',
    });
  }

  const parsed = parseWith(commentSchema, { body: form.get('body') });
  if (!parsed.ok) return data({ errors: parsed.errors }, { status: 400 });
  const commentId = await addComment(db, postId, user.id, parsed.data.body);
  return redirectWithToast(request, `/blog/${postId}#comment-${commentId}`, {
    kind: 'success',
    title: 'Comment posted',
    message: 'Thanks for joining the conversation.',
  });
}

function paragraphs(text: string) {
  return text
    .split(/\n\s*\n|\r\n\s*\r\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function PostPage({ loaderData, actionData }: Route.ComponentProps) {
  const { post, user } = loaderData;
  const navigation = useNavigation();
  const isOwner = user?.id === post.author.id;
  const errors = actionData && 'errors' in actionData ? actionData.errors : undefined;
  const resetKey = navigation.state === 'idle' && !errors ? post.thread.length : 'pending';

  return (
    <div className="container">
      <article className="article" aria-labelledby="post-title">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            {post.category ? (
              <li>
                <Link to={`/?category=${post.category.slug}`}>{post.category.name}</Link>
              </li>
            ) : null}
            <li>
              <span aria-current="page">{post.title}</span>
            </li>
          </ol>
        </nav>

        <header className="article__head">
          <p className="eyebrow">{post.category?.name ?? 'Uncategorised'}</p>
          <ViewTransition name={`post-title-${post.id}`}>
            <h1 className="article__title" id="post-title">
              {post.title}
            </h1>
          </ViewTransition>
          <p className="article__lede">{post.summary}</p>
          <Byline
            username={post.author.username}
            date={post.publishedAt}
            readingMinutes={post.readingMinutes}
            long
            avatar="lg"
          />
          {post.updatedAt ? (
            <p className="mono muted">
              Edited{' '}
              <time dateTime={isoDate(post.updatedAt)}>{formatLongDate(post.updatedAt)}</time>
            </p>
          ) : null}
          <TagList tags={post.tags} />
        </header>

        {isOwner ? (
          <div className="owner-bar">
            <p>
              <strong>This is your post.</strong>
            </p>
            <div className="button-row">
              <Link className="button button--small" to={`/dashboard/${post.id}/edit`}>
                <PencilIcon /> Edit<span className="visually-hidden"> “{post.title}”</span>
              </Link>
              <ConfirmDelete action={`/blog/${post.id}`} title={post.title} />
            </div>
          </div>
        ) : null}

        <div className="article__body">
          {paragraphs(post.body).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <section className="comments" id="comments" aria-labelledby="comments-title">
          <h2 id="comments-title">
            Comments <span className="muted">({post.thread.length})</span>
          </h2>
          {post.thread.length ? (
            <ol className="comment-list" role="list">
              {post.thread.map((comment) => (
                <li key={comment.id} id={`comment-${comment.id}`}>
                  <article className="comment" aria-label={`Comment by ${comment.author.username}`}>
                    <Avatar username={comment.author.username} />
                    <div>
                      <p className="comment__meta">
                        <strong>{comment.author.username}</strong>
                        <time dateTime={isoDate(comment.createdAt)}>
                          {formatLongDate(comment.createdAt)}
                        </time>
                        {user?.id === comment.author.id ? (
                          <Form method="post">
                            <input type="hidden" name="commentId" value={comment.id} />
                            <button
                              className="link-button"
                              type="submit"
                              name="intent"
                              value="delete-comment"
                            >
                              Delete<span className="visually-hidden"> your comment</span>
                            </button>
                          </Form>
                        ) : null}
                      </p>
                      <p className="comment__body">{comment.body}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          ) : (
            <p className="muted">No comments yet. Start the conversation.</p>
          )}

          {user ? (
            <div className="card">
              <h3 className="card__kicker">Leave a comment</h3>
              <Form method="post" className="form" key={resetKey} noValidate>
                <ErrorSummary errors={errors} />
                <Field
                  name="body"
                  label={`Comment as ${user.username}`}
                  multiline="short"
                  maxLength={LIMITS.comment}
                  errors={errors}
                />
                <div className="button-row">
                  <SubmitButton intent="comment" pendingLabel="Posting…">
                    Post comment
                  </SubmitButton>
                </div>
              </Form>
            </div>
          ) : (
            <div className="card">
              <p>
                <Link to={`/login?redirectTo=${encodeURIComponent(`/blog/${post.id}#comments`)}`}>
                  Log in or sign up
                </Link>{' '}
                to leave a comment.
              </p>
            </div>
          )}
        </section>
      </article>
    </div>
  );
}
