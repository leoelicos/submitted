import { existsSync } from 'node:fs';

// Load .env for local dev/start without a dotenv dependency (Node >= 21).
if (existsSync('.env')) {
  try {
    process.loadEnvFile('.env');
  } catch {
    // Ignore malformed .env; real environments inject variables directly.
  }
}
