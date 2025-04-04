import { like, sql } from 'drizzle-orm';
import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core';

const article = sqliteTable('article', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  link: text('link').notNull(),
  pubDate: text('pubDate').notNull(),
  hostname: text('hostname').notNull(),
  pv: integer('pv').default(0),
  like: integer('like').default(0),
  updateAt: integer('update_at').default(Math.floor(Date.now() / 1000)).$onUpdate(() => Math.floor(Date.now() / 1000)), // 自动更新
  createdAt: integer('created_at').default(Math.floor(Date.now() / 1000)),
});

export type Article = typeof article.$inferSelect;
export type NewArticle = typeof article.$inferInsert;
export default article;