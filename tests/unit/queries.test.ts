import { beforeAll, describe, expect, it } from 'vitest';
import { createPgliteDatabase, type Database } from '~/lib/db.server';
import {
  addComment,
  createPost,
  createUser,
  dashboardStats,
  deleteComment,
  deletePost,
  getPost,
  listPosts,
  listTaxonomy,
  updatePost,
  usernameTaken,
  verifyLogin,
} from '~/lib/queries.server';
import { seedDatabase } from '~/lib/seed.server';
import { DEMO_PASSWORD, seedPosts } from '~/lib/seed-data';

let db: Database;

beforeAll(async () => {
  db = await createPgliteDatabase();
});

describe('seeded content', () => {
  it('carries over every original post, newest first', async () => {
    const posts = await listPosts(db);
    expect(posts).toHaveLength(seedPosts.length);
    expect(posts[0]?.title).toBe('Project 2, what to do?');
    expect(posts.at(-1)?.title).toBe("Code refactor, how do you even say 'Horiseon'?");
  });

  it('keeps the original tag and category relationships', async () => {
    const [first] = await listPosts(db, { q: 'Project 2' });
    expect(first?.category?.name).toBe('Projects');
    expect(first?.tags.map((t) => t.name)).toEqual(['Express.js', 'Handlebars.js']);
    expect(first?.author.username).toBe('EllaCochran');
  });

  it('is idempotent', async () => {
    expect(await seedDatabase(db)).toBe(false);
  });

  it('counts posts per category and tag', async () => {
    const { categories, tags } = await listTaxonomy(db);
    expect(categories.map((c) => c.name)).toEqual([
      'Homework',
      'Challenges',
      'Projects',
      'Mini-projects',
    ]);
    expect(tags.find((t) => t.slug === 'expressjs')?.postCount).toBe(5);
  });
});

describe('filters', () => {
  it('filters by category slug', async () => {
    const posts = await listPosts(db, { category: 'projects' });
    expect(posts.map((p) => p.title)).toEqual([
      'Project 2, what to do?',
      'Project 1, easier said than done!',
    ]);
  });

  it('filters by tag slug', async () => {
    const posts = await listPosts(db, { tag: 'sequelize' });
    expect(posts).toHaveLength(1);
  });

  it('treats LIKE wildcards in search literally', async () => {
    expect(await listPosts(db, { q: '%' })).toHaveLength(0);
  });
});

describe('auth', () => {
  it('verifies the demo accounts case-insensitively', async () => {
    expect(await verifyLogin(db, 'ellacochran', DEMO_PASSWORD)).toMatchObject({
      username: 'EllaCochran',
    });
    expect(await verifyLogin(db, 'EllaCochran', 'wrong-password')).toBeNull();
    expect(await verifyLogin(db, 'nobody', DEMO_PASSWORD)).toBeNull();
  });

  it('enforces unique usernames', async () => {
    await createUser(db, 'NewStudent', 'correct horse battery');
    expect(await usernameTaken(db, 'newstudent')).toBe(true);
    await expect(createUser(db, 'newSTUDENT', 'another password')).rejects.toThrow(
      /users_username_lower_idx|duplicate key|Failed query/,
    );
  });
});

describe('posts + comments', () => {
  it('creates, edits, comments on and deletes a post with ownership checks', async () => {
    const author = await createUser(db, 'Author1', 'password12345');
    const intruder = await createUser(db, 'Intruder', 'password12345');
    const { tags } = await listTaxonomy(db);
    const css = tags.find((t) => t.slug === 'css');
    const html = tags.find((t) => t.slug === 'html');

    const id = await createPost(db, author.id, {
      title: 'Hello',
      summary: 'First post',
      body: 'Body text',
      tagIds: [css!.id],
    });
    expect((await getPost(db, id))?.tags.map((t) => t.slug)).toEqual(['css']);

    const input = { title: 'Hacked', summary: 's', body: 'b', tagIds: [] };
    expect(await updatePost(db, id, intruder.id, input)).toBe(false);
    expect(await deletePost(db, id, intruder.id)).toBeNull();

    expect(
      await updatePost(db, id, author.id, {
        ...input,
        title: 'Hello again',
        tagIds: [html!.id, css!.id],
      }),
    ).toBe(true);
    const updated = await getPost(db, id);
    expect(updated?.title).toBe('Hello again');
    expect(updated?.tags.map((t) => t.slug)).toEqual(['css', 'html']);
    expect(updated?.updatedAt).toBeInstanceOf(Date);

    const commentId = await addComment(db, id, intruder.id, 'Nice one');
    expect((await getPost(db, id))?.thread).toHaveLength(1);
    expect(await dashboardStats(db, author.id)).toEqual({ posts: 1, commentsReceived: 1 });
    expect(await deleteComment(db, commentId!, author.id)).toBe(false);

    expect(await deletePost(db, id, author.id)).toMatchObject({ id });
    expect(await getPost(db, id)).toBeNull();
  });
});
