import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const config = sqliteTable('config', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull(),
  value: text('value').notNull(),
  createdAt: integer('created_at').default(Math.floor(Date.now() / 1000)),
});

export type Config = typeof config.$inferSelect;
export type NewConfig = typeof config.$inferInsert;
export default config;