// db/client.ts
import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';

export function createDbClient(db: D1Database) {
  return drizzle(db);
}

export type DbClient = ReturnType<typeof createDbClient>;