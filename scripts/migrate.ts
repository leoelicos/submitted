import { applyMigrations } from '../app/lib/migrate';
import { connect, readMigrations } from './connect';

const { db, close, label } = await connect();
const applied = await applyMigrations(db, readMigrations());
console.log(
  applied.length ? `Applied ${applied.join(', ')} to ${label}` : `${label} is up to date`,
);
await close();
