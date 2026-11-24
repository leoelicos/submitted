import { sql } from 'drizzle-orm';
import type { Database } from './db-types';

export interface Migration {
  name: string;
  sql: string;
}

/**
 * Tiny, driver-agnostic migrator for the SQL files drizzle-kit generates in
 * /drizzle. Used by both the CLI (`npm run db:migrate`) and the zero-config
 * PGlite demo database, so there is exactly one way migrations get applied.
 */
export async function applyMigrations(db: Database, migrations: readonly Migration[]) {
  await db.execute(
    sql`create table if not exists __submitted_migrations (name text primary key, applied_at timestamptz not null default now())`,
  );
  // Both node-postgres and PGlite resolve raw queries to `{ rows }`.
  const applied = (await db.execute(sql`select name from __submitted_migrations`)) as unknown as {
    rows: { name: string }[];
  };
  const done = new Set(applied.rows.map((row) => row.name));

  const pending = migrations
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .filter((migration) => !done.has(migration.name));

  for (const migration of pending) {
    await db.transaction(async (tx) => {
      for (const statement of migration.sql.split('--> statement-breakpoint')) {
        if (statement.trim()) await tx.execute(sql.raw(statement));
      }
      await tx.execute(sql`insert into __submitted_migrations (name) values (${migration.name})`);
    });
  }
  return pending.map((migration) => migration.name);
}
