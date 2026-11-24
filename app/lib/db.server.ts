import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import type { Database } from './db-types';
import './env.server';
import { applyMigrations } from './migrate';
import { migrations } from './migrations.server';
import * as schema from './schema';
import { seedDatabase } from './seed.server';

export type { Database };

/**
 * DATABASE_URL set   -> real Postgres (Neon, Vercel Postgres, Supabase, local).
 * DATABASE_URL unset -> PGlite: Postgres compiled to WASM, in-process. Stored in
 *                       PGLITE_DIR if set, otherwise in memory. Migrated and seeded
 *                       with the original content on first use, so `npm run dev`
 *                       (and preview deploys) work with zero setup.
 */
export function isDemoDatabase() {
  return !process.env.DATABASE_URL;
}

export async function createPgliteDatabase(dataDir?: string): Promise<Database> {
  const client = dataDir ? new PGlite(dataDir) : new PGlite();
  await client.waitReady;
  const db = drizzlePglite({ client, schema, casing: 'snake_case' }) as unknown as Database;
  await applyMigrations(db, migrations);
  await seedDatabase(db);
  return db;
}

function createPostgresDatabase(url: string): Database {
  // pg is CommonJS; the default import is the supported ESM interop path.
  // oxlint-disable-next-line import/no-named-as-default-member
  const pool = new pg.Pool({ connectionString: url, max: 5 });
  return drizzlePg({ client: pool, schema, casing: 'snake_case' }) as unknown as Database;
}

declare global {
  // Survives Vite HMR in dev so we don't open a new pool on every edit.
  var __submittedDb: Promise<Database> | undefined;
}

export function getDb(): Promise<Database> {
  globalThis.__submittedDb ??= process.env.DATABASE_URL
    ? Promise.resolve(createPostgresDatabase(process.env.DATABASE_URL))
    : createPgliteDatabase(process.env.PGLITE_DIR || undefined);
  return globalThis.__submittedDb;
}
