import type { Migration } from './migrate';

// Vite inlines the drizzle-kit SQL at build time, so the demo database works in
// any deployment target without needing the /drizzle folder on disk.
const files = import.meta.glob<string>('../../drizzle/*.sql', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export const migrations: Migration[] = Object.entries(files).map(([path, sql]) => ({
  name:
    path
      .split('/')
      .pop()
      ?.replace(/\.sql$/, '') ?? path,
  sql,
}));
