import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const rss = sqliteTable('rss', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  rssUrl: text('rss_url').notNull().unique(),
  title: text('title').notNull(),
  email: text('email').default(''),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  errorCount: integer('error_count').default(0),
  auditStatus: integer('audit_status').default(0), // 审核状态 0 未审核 1 通过
  init: integer('init', { mode: 'boolean' }).default(false),
  updateAt: integer('update_at').default(Math.floor(Date.now() / 1000)).$onUpdate(() => Math.floor(Date.now() / 1000)), // 自动更新
  createdAt: integer('created_at').default(Math.floor(Date.now() / 1000)),
});

export type Rss = typeof rss.$inferSelect;
export type NewRss = typeof rss.$inferInsert;
export default rss;