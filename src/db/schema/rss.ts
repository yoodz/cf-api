import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const rss = sqliteTable('rss', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  rssUrl: text('rss_url').notNull().unique(),
  title: text('title').notNull(),
  email: text('email'),
  isDeleted: integer('is_deleted'),
  errorCount: integer('error_count'),
  auditStatus: integer('audit_status'), // 审核状态 0 未审核 1 通过
  init: integer('init'),
  updateAt: integer('update_at'),
  createdAt: integer('created_at')
});

export type Rss = typeof rss.$inferSelect;
export type NewRss = typeof rss.$inferInsert;
export default rss;