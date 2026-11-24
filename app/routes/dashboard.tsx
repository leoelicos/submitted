import { Link } from 'react-router';
import type { Route } from './+types/dashboard';
import { ConfirmDelete } from '~/components/ConfirmDelete';
import { CommentIcon, PencilIcon, PlusIcon } from '~/components/icons';
import { TagList } from '~/components/PostCard';
import { getDb } from '~/lib/db.server';
import { pageMeta } from '~/lib/meta';
import { dashboardStats, listPosts } from '~/lib/queries.server';
import { requireUser, userContext } from '~/lib/session.server';
import { formatShortDate, isoDate } from '~/lib/text';

export const meta = () => pageMeta('Dashboard');

export async function loader({ request, context }: Route.LoaderArgs) {
  const user = requireUser(context.get(userContext), request);
  const db = await getDb();
  const [posts, stats] = await Promise.all([
    listPosts(db, { authorId: user.id }),
    dashboardStats(db, user.id),
  ]);
  return { user, posts, stats };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { user, posts, stats } = loaderData;
  return (
    <div className="container">
      <header className="page-head">
        <p className="eyebrow">Dashboard</p>
        <h1>Welcome, {user.username}!</h1>
        <p>Your posts, your comments, your progress.</p>
      </header>

      <dl className="stats">
        <div className="stat">
          <dt>Posts submitted</dt>
          <dd>{stats.posts}</dd>
        </div>
        <div className="stat">
          <dt>Comments received</dt>
          <dd>{stats.commentsReceived}</dd>
        </div>
      </dl>

      <div className="results-bar">
        <h2 id="my-posts-title">Your posts</h2>
        <Link className="button" to="/dashboard/new">
          <PlusIcon /> Write a new post
        </Link>
      </div>

      {posts.length ? (
        <ul className="my-posts" role="list" aria-labelledby="my-posts-title">
          {posts.map((post) => (
            <li key={post.id} className="my-post">
              <div className="stack" style={{ '--stack-space': '0.4rem' } as React.CSSProperties}>
                <p className="eyebrow">{post.category?.name ?? 'Uncategorised'}</p>
                <h3>
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h3>
                <p className="muted">{post.summary}</p>
                <p className="byline">
                  <time dateTime={isoDate(post.publishedAt)}>
                    {formatShortDate(post.publishedAt)}
                  </time>
                  <span className="dot comment-count">
                    <CommentIcon /> {post.commentCount}{' '}
                    {post.commentCount === 1 ? 'comment' : 'comments'}
                  </span>
                </p>
                <TagList tags={post.tags} />
              </div>
              <div className="button-row">
                <Link className="button button--small" to={`/dashboard/${post.id}/edit`}>
                  <PencilIcon /> Edit<span className="visually-hidden"> “{post.title}”</span>
                </Link>
                <ConfirmDelete action={`/blog/${post.id}`} title={post.title} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">
          <span className="stamp" aria-hidden="true">
            Blank page
          </span>
          <p>No blogs yet. Your first post is one click away.</p>
          <Link className="button" to="/dashboard/new">
            <PlusIcon /> Write your first post
          </Link>
        </div>
      )}
    </div>
  );
}
