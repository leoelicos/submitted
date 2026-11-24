import { applyMigrations } from '../app/lib/migrate';
import { seedDatabase } from '../app/lib/seed.server';
import { connect, readMigrations } from './connect';

const { db, close, label } = await connect();
await applyMigrations(db, readMigrations());
const seeded = await seedDatabase(db);
console.log(
  seeded ? `Seeded the original 2022 content into ${label}` : `${label} already has data; skipped`,
);
await close();
