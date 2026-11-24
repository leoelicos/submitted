import { count } from 'drizzle-orm';
import type { Database } from './db-types';
import { hashPassword } from './password.server';
import { categories, comments, posts, postTags, tags, users } from './schema';
import {
  DEMO_PASSWORD,
  seedCategories,
  seedComments,
  seedPosts,
  seedTags,
  seedUsers,
} from './seed-data';
import { slugify } from './text';

function pick<T>(list: readonly T[], oneBasedIndex: number): T {
  const item = list[oneBasedIndex - 1];
  if (item === undefined) throw new Error(`Seed reference ${oneBasedIndex} is out of range`);
  return item;
}

/** Seeds the original 2022 content. Safe to call repeatedly: no-ops if users exist. */
export async function seedDatabase(db: Database): Promise<boolean> {
  const [existing] = await db.select({ value: count() }).from(users);
  if ((existing?.value ?? 0) > 0) return false;

  const hashes = await Promise.all(seedUsers.map(() => hashPassword(DEMO_PASSWORD)));

  await db.transaction(async (tx) => {
    const userRows = await tx
      .insert(users)
      .values(seedUsers.map((username, i) => ({ username, passwordHash: hashes[i] ?? '' })))
      .returning({ id: users.id });
    const categoryRows = await tx
      .insert(categories)
      .values(seedCategories.map((name) => ({ name, slug: slugify(name) })))
      .returning({ id: categories.id });
    const tagRows = await tx
      .insert(tags)
      .values(seedTags.map((name) => ({ name, slug: slugify(name) })))
      .returning({ id: tags.id });

    const postRows = await tx
      .insert(posts)
      .values(
        seedPosts.map((post) => ({
          title: post.title,
          summary: post.summary,
          body: post.body,
          publishedAt: new Date(post.publishedAt),
          authorId: pick(userRows, post.authorIndex).id,
          categoryId: pick(categoryRows, post.categoryIndex).id,
        })),
      )
      .returning({ id: posts.id });

    await tx.insert(postTags).values(
      seedPosts.flatMap((post, i) =>
        post.tagIndexes.map((tagIndex) => ({
          postId: pick(postRows, i + 1).id,
          tagId: pick(tagRows, tagIndex).id,
        })),
      ),
    );

    await tx.insert(comments).values(
      seedComments.map((comment) => {
        const post = seedPosts[comment.postIndex - 1];
        // Comments land a day after their post so the timeline reads naturally.
        const createdAt = new Date(
          new Date(post?.publishedAt ?? Date.now()).getTime() + 86_400_000,
        );
        return {
          body: comment.body,
          authorId: pick(userRows, comment.authorIndex).id,
          postId: pick(postRows, comment.postIndex).id,
          createdAt,
        };
      }),
    );
  });
  return true;
}
