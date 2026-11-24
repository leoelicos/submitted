import { readdirSync, readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import type { Database } from '../app/lib/db-types';
import type { Migration } from '../app/lib/migrate';
import * as schema from '../app/lib/schema';

if (process.env.DATABASE_URL === undefined) {
  try {
    process.loadEnvFile('.env');
  } catch {
    // no .env, fine
  }
}

export function readMigrations(): Migration[] {
  return readdirSync('drizzle')
    .filter((file) => file.endsWith('.sql'))
    .map((file) => ({
      name: file.replace(/\.sql$/, ''),
      sql: readFileSync(`drizzle/${file}`, 'utf8'),
    }));
}

/** CLI connection: DATABASE_URL (Postgres) or PGLITE_DIR (local PGlite folder). */
export async function connect(): Promise<{
  db: Database;
  close: () => Promise<void>;
  label: string;
}> {
  if (process.env.DATABASE_URL) {
    // oxlint-disable-next-line import/no-named-as-default-member
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    return {
      db: drizzlePg({ client: pool, schema, casing: 'snake_case' }) as unknown as Database,
      close: () => pool.end(),
      label: 'DATABASE_URL',
    };
  }
  const dir = process.env.PGLITE_DIR;
  if (!dir) {
    throw new Error(
      'Set DATABASE_URL (Postgres) or PGLITE_DIR (local PGlite) first. See .env.example.',
    );
  }
  const client = new PGlite(dir);
  await client.waitReady;
  return {
    db: drizzlePglite({ client, schema, casing: 'snake_case' }) as unknown as Database,
    close: () => client.close(),
    label: `PGlite at ${dir}`,
  };
}
