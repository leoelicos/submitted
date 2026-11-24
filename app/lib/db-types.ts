import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import type * as schema from './schema';

/** Common type for the node-postgres (production) and PGlite (demo/test) drivers. */
export type Database = PgDatabase<PgQueryResultHKT, typeof schema>;
