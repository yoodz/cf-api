import { like, sql } from 'drizzle-orm';
import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core';

const article = sqliteTable('article', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  link: text('link').notNull(),
  pubDate: text('pubDate').notNull(),
  hostname: text('hostname').notNull(),
  pv: integer('pv'),
  like: integer('like'),
  updateAt: integer('update_at'), // 自动更新
  createdAt: integer('created_at'),
});

export type Article = typeof article.$inferSelect;
export type NewArticle = typeof article.$inferInsert;
export default article;