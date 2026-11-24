import { ViewTransition } from 'react';
import { Link } from 'react-router';
import type { PostSummary } from '~/lib/queries.server';
import { Byline } from './Byline';
import { CommentIcon } from './icons';

type SerializedPost = Omit<PostSummary, 'publishedAt' | 'updatedAt'> & {
  publishedAt: Date | string;
  updatedAt: Date | string | null;
};

export function TagList({ tags }: { tags: { id: number; name: string; slug: string }[] }) {
  if (!tags.length) return null;
  return (
    <ul className="tag-list" role="list" aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag.id}>
          <Link className="tag" to={`/?tag=${tag.slug}`}>
            {tag.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function PostCard({
  post,
  headingLevel = 3,
}: {
  post: SerializedPost;
  headingLevel?: 2 | 3;
}) {
  const Heading = `h${headingLevel}` as const;
  const titleId = `post-${post.id}-title`;
  return (
    <article className="post-card" aria-labelledby={titleId}>
      <div className="post-card__top">
        <p className="eyebrow">{post.category?.name ?? 'Uncategorised'}</p>
        <span className="comment-count">
          <CommentIcon />
          {post.commentCount}
          <span className="visually-hidden">
            {post.commentCount === 1 ? ' comment' : ' comments'}
          </span>
        </span>
      </div>
      <ViewTransition name={`post-title-${post.id}`}>
        <Heading className="post-card__title" id={titleId}>
          <Link className="post-card__link" to={`/blog/${post.id}`}>
            {post.title}
          </Link>
        </Heading>
      </ViewTransition>
      <p className="post-card__summary">{post.summary}</p>
      <div className="post-card__foot">
        <Byline
          username={post.author.username}
          date={post.publishedAt}
          readingMinutes={post.readingMinutes}
        />
        <TagList tags={post.tags} />
      </div>
    </article>
  );
}
