import { Form, Link, useNavigation, useSearchParams } from 'react-router';
import type { Route } from './+types/home';
import { PostCard } from '~/components/PostCard';
import { SearchIcon } from '~/components/icons';
import { getDb } from '~/lib/db.server';
import { pageMeta, SITE_TAGLINE } from '~/lib/meta';
import { listPosts, listTaxonomy } from '~/lib/queries.server';

export function meta({ loaderData }: Route.MetaArgs) {
  const active = loaderData?.activeLabel;
  return pageMeta(active ? `Posts ${active}` : null);
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category') || undefined;
  const tag = url.searchParams.get('tag') || undefined;
  const q = url.searchParams.get('q')?.slice(0, 100) || undefined;
  const db = await getDb();
  const [posts, taxonomy, all] = await Promise.all([
    listPosts(db, { category, tag, q }),
    listTaxonomy(db),
    category || tag || q ? listPosts(db) : null,
  ]);
  const everything = all ?? posts;
  const activeCategory = taxonomy.categories.find((c) => c.slug === category);
  const activeTag = taxonomy.tags.find((t) => t.slug === tag);
  const activeLabel = [
    activeCategory && `in ${activeCategory.name}`,
    activeTag && `tagged ${activeTag.name}`,
    q && `matching “${q}”`,
  ]
    .filter(Boolean)
    .join(', ');
  return {
    posts,
    taxonomy,
    activeLabel,
    stats: {
      posts: everything.length,
      authors: new Set(everything.map((p) => p.author.id)).size,
      topics: taxonomy.tags.length,
    },
  };
}

function withParam(params: URLSearchParams, key: string, value: string | null) {
  const next = new URLSearchParams(params);
  if (value === null || next.get(key) === value) next.delete(key);
  else next.set(key, value);
  const query = next.toString();
  return query ? `/?${query}` : '/';
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { posts, taxonomy, activeLabel, stats } = loaderData;
  const [params] = useSearchParams();
  const navigation = useNavigation();
  const searching = navigation.state === 'loading' && navigation.location.pathname === '/';
  const category = params.get('category');
  const tag = params.get('tag');
  const q = params.get('q') ?? '';
  const filtered = Boolean(category || tag || q);

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__grid">
          <div>
            <h1 className="hero__title" id="hero-title" aria-label="Submitted!">
              Submitted
              <span className="bang" aria-hidden="true">
                !
              </span>
            </h1>
            <p className="hero__subtitle">{SITE_TAGLINE}</p>
            <p className="hero__lede">
              Honest notes, tips and war stories from every assignment in the full-stack bootcamp,
              from the Horiseon refactor to Project 2.
            </p>
            <dl className="hero__stats">
              <div>
                <dt>Posts</dt>
                <dd>{stats.posts}</dd>
              </div>
              <div>
                <dt>Students</dt>
                <dd>{stats.authors}</dd>
              </div>
              <div>
                <dt>Topics</dt>
                <dd>{stats.topics}</dd>
              </div>
            </dl>
          </div>
          <div className="hero__art" aria-hidden="true">
            <div className="paper-card">
              <p className="eyebrow">Assignment</p>
              <div className="paper-card__lines">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <span className="stamp">
                Submitted
                <small>On time · A+</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <section className="filters" aria-label="Find a post">
          <search>
            <Form method="get" className="search" preventScrollReset>
              {category ? <input type="hidden" name="category" value={category} /> : null}
              {tag ? <input type="hidden" name="tag" value={tag} /> : null}
              <label className="visually-hidden" htmlFor="q">
                Search posts
              </label>
              <input
                className="input"
                id="q"
                name="q"
                type="search"
                defaultValue={q}
                key={q}
                placeholder="Search posts, e.g. “flexbox”"
                autoComplete="off"
                enterKeyHint="search"
              />
              <button className="button" type="submit">
                <SearchIcon />
                Search
              </button>
            </Form>
          </search>

          <nav aria-label="Categories" className="chip-group">
            <span className="chip-group__label" aria-hidden="true">
              Category
            </span>
            <Link
              className="chip"
              to={withParam(params, 'category', null)}
              aria-current={!category ? 'page' : undefined}
              preventScrollReset
            >
              All
            </Link>
            {taxonomy.categories.map((c) => (
              <Link
                key={c.id}
                className="chip"
                to={withParam(params, 'category', c.slug)}
                aria-current={category === c.slug ? 'page' : undefined}
                preventScrollReset
              >
                {c.name}{' '}
                <span className="chip__count">
                  {c.postCount}
                  <span className="visually-hidden"> posts</span>
                </span>
              </Link>
            ))}
          </nav>

          <nav aria-label="Tags" className="chip-group">
            <span className="chip-group__label" aria-hidden="true">
              Tag
            </span>
            {taxonomy.tags.map((t) => (
              <Link
                key={t.id}
                className="chip"
                to={withParam(params, 'tag', t.slug)}
                aria-current={tag === t.slug ? 'page' : undefined}
                preventScrollReset
              >
                {t.name}{' '}
                <span className="chip__count">
                  {t.postCount}
                  <span className="visually-hidden"> posts</span>
                </span>
              </Link>
            ))}
          </nav>
        </section>

        <div className="results-bar">
          <h2 id="results-title">{filtered ? 'Results' : 'Latest posts'}</h2>
          <p className="muted" role="status" aria-live="polite" aria-busy={searching}>
            {posts.length === 1 ? '1 post' : `${posts.length} posts`}
            {activeLabel ? ` ${activeLabel}` : ''}
            {filtered ? (
              <>
                {' · '}
                <Link to="/" preventScrollReset>
                  Clear filters
                </Link>
              </>
            ) : null}
          </p>
        </div>

        {posts.length ? (
          <ul className="post-grid" role="list" aria-labelledby="results-title">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty">
            <span className="stamp" aria-hidden="true">
              Nothing yet
            </span>
            <p>
              {filtered
                ? 'No posts match those filters.'
                : 'No blogs yet. Be the first to submit one!'}
            </p>
            <Link className="button" to={filtered ? '/' : '/dashboard/new'}>
              {filtered ? 'Clear filters' : 'Write a post'}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
