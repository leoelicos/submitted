import { and, asc, count, desc, eq, ilike, inArray, or, sql, type SQL } from 'drizzle-orm';
import type { Database } from './db-types';
import { hashPassword, verifyPassword } from './password.server';
import { categories, comments, posts, postTags, tags, users } from './schema';
import { readingMinutes } from './text';

export interface PostFilters {
  category?: string | undefined;
  tag?: string | undefined;
  q?: string | undefined;
  authorId?: number | undefined;
}

export interface PostInput {
  title: string;
  summary: string;
  body: string;
  categoryId?: number | undefined;
  tagIds: number[];
}

const postWith = {
  author: { columns: { id: true, username: true } },
  category: { columns: { id: true, name: true, slug: true } },
  postTags: { with: { tag: { columns: { id: true, name: true, slug: true } } } },
  comments: { columns: { id: true } },
} as const;

function escapeLike(term: string) {
  return term.replace(/[\\%_]/g, (match) => `\\${match}`);
}

function shapePost<
  T extends {
    postTags: { tag: { id: number; name: string; slug: string } }[];
    comments: { id: number }[];
    body: string;
  },
>(row: T) {
  const { postTags: links, comments: commentIds, ...rest } = row;
  return {
    ...rest,
    tags: links.map((link) => link.tag).toSorted((a, b) => a.name.localeCompare(b.name)),
    commentCount: commentIds.length,
    readingMinutes: readingMinutes(row.body),
  };
}

export async function listPosts(db: Database, filters: PostFilters = {}) {
  const where: SQL[] = [];
  if (filters.authorId) where.push(eq(posts.authorId, filters.authorId));
  if (filters.category) {
    where.push(
      inArray(
        posts.categoryId,
        db
          .select({ id: categories.id })
          .from(categories)
          .where(eq(categories.slug, filters.category)),
      ),
    );
  }
  if (filters.tag) {
    where.push(
      inArray(
        posts.id,
        db
          .select({ id: postTags.postId })
          .from(postTags)
          .innerJoin(tags, eq(tags.id, postTags.tagId))
          .where(eq(tags.slug, filters.tag)),
      ),
    );
  }
  const q = filters.q?.trim();
  if (q) {
    const term = `%${escapeLike(q)}%`;
    const match = or(ilike(posts.title, term), ilike(posts.summary, term), ilike(posts.body, term));
    if (match) where.push(match);
  }

  const rows = await db.query.posts.findMany({
    where: where.length ? and(...where) : undefined,
    orderBy: [desc(posts.publishedAt), desc(posts.id)],
    with: postWith,
  });
  return rows.map(shapePost);
}

export type PostSummary = Awaited<ReturnType<typeof listPosts>>[number];

export async function getPost(db: Database, id: number) {
  const row = await db.query.posts.findFirst({
    where: eq(posts.id, id),
    with: postWith,
  });
  if (!row) return null;
  const thread = await db.query.comments.findMany({
    where: eq(comments.postId, id),
    orderBy: [asc(comments.createdAt), asc(comments.id)],
    with: { author: { columns: { id: true, username: true } } },
  });
  return { ...shapePost(row), thread };
}

export type PostDetail = NonNullable<Awaited<ReturnType<typeof getPost>>>;

export async function listTaxonomy(db: Database) {
  const [allCategories, allTags] = await Promise.all([
    db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        postCount: count(posts.id),
      })
      .from(categories)
      .leftJoin(posts, eq(posts.categoryId, categories.id))
      .groupBy(categories.id)
      .orderBy(asc(categories.id)),
    db
      .select({ id: tags.id, name: tags.name, slug: tags.slug, postCount: count(postTags.postId) })
      .from(tags)
      .leftJoin(postTags, eq(postTags.tagId, tags.id))
      .groupBy(tags.id)
      .orderBy(asc(sql`lower(${tags.name})`)),
  ]);
  return { categories: allCategories, tags: allTags };
}

async function replaceTags(tx: Database, postId: number, tagIds: readonly number[]) {
  await tx.delete(postTags).where(eq(postTags.postId, postId));
  const unique = [...new Set(tagIds)];
  if (unique.length) {
    await tx.insert(postTags).values(unique.map((tagId) => ({ postId, tagId })));
  }
}

export async function createPost(db: Database, authorId: number, input: PostInput) {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .insert(posts)
      .values({
        title: input.title,
        summary: input.summary,
        body: input.body,
        categoryId: input.categoryId ?? null,
        authorId,
      })
      .returning({ id: posts.id });
    if (!row) throw new Error('Insert returned no row');
    await replaceTags(tx as unknown as Database, row.id, input.tagIds);
    return row.id;
  });
}

/** Returns false when the post doesn't exist or isn't owned by `authorId`. */
export async function updatePost(db: Database, id: number, authorId: number, input: PostInput) {
  return db.transaction(async (tx) => {
    const updated = await tx
      .update(posts)
      .set({
        title: input.title,
        summary: input.summary,
        body: input.body,
        categoryId: input.categoryId ?? null,
        updatedAt: new Date(),
      })
      .where(and(eq(posts.id, id), eq(posts.authorId, authorId)))
      .returning({ id: posts.id });
    if (!updated.length) return false;
    await replaceTags(tx as unknown as Database, id, input.tagIds);
    return true;
  });
}

export async function deletePost(db: Database, id: number, authorId: number) {
  const deleted = await db
    .delete(posts)
    .where(and(eq(posts.id, id), eq(posts.authorId, authorId)))
    .returning({ id: posts.id, title: posts.title });
  return deleted[0] ?? null;
}

export async function addComment(db: Database, postId: number, authorId: number, body: string) {
  const [row] = await db
    .insert(comments)
    .values({ postId, authorId, body })
    .returning({ id: comments.id });
  return row?.id ?? null;
}

export async function deleteComment(db: Database, id: number, authorId: number) {
  const deleted = await db
    .delete(comments)
    .where(and(eq(comments.id, id), eq(comments.authorId, authorId)))
    .returning({ id: comments.id });
  return deleted.length > 0;
}

export async function findUserById(db: Database, id: number) {
  const [row] = await db
    .select({ id: users.id, username: users.username })
    .from(users)
    .where(eq(users.id, id));
  return row ?? null;
}

export async function usernameTaken(db: Database, username: string) {
  const [row] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(sql`lower(${users.username})`, username.toLowerCase()));
  return Boolean(row);
}

export async function createUser(db: Database, username: string, password: string) {
  const passwordHash = await hashPassword(password);
  const [row] = await db
    .insert(users)
    .values({ username, passwordHash })
    .returning({ id: users.id, username: users.username });
  if (!row) throw new Error('Insert returned no row');
  return row;
}

/** Constant-ish time login: always runs a hash comparison, even for unknown users. */
const DUMMY_HASH =
  'scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';

export async function verifyLogin(db: Database, username: string, password: string) {
  const [row] = await db
    .select({ id: users.id, username: users.username, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(sql`lower(${users.username})`, username.toLowerCase()));
  const ok = await verifyPassword(password, row?.passwordHash ?? DUMMY_HASH);
  return ok && row ? { id: row.id, username: row.username } : null;
}

export async function dashboardStats(db: Database, authorId: number) {
  const [postCount, commentCount] = await Promise.all([
    db.select({ value: count() }).from(posts).where(eq(posts.authorId, authorId)),
    db
      .select({ value: count() })
      .from(comments)
      .innerJoin(posts, eq(posts.id, comments.postId))
      .where(eq(posts.authorId, authorId)),
  ]);
  return { posts: postCount[0]?.value ?? 0, commentsReceived: commentCount[0]?.value ?? 0 };
}
