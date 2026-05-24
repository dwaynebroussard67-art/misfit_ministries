import { mysqlTable, serial, text, boolean, timestamp } from 'drizzle-orm/mysql-core';

export const testimonies = mysqlTable('testimonies', {
  id: serial('id').primaryKey(),
  name: text('name'),
  title: text('title'),
  story: text('story').notNull(),
  approved: boolean('approved').default(false),
  auto_approved: boolean('auto_approved').default(false),
  featured: boolean('featured').default(false),
  deletedAt: timestamp('deleted_at'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export type Testimony = typeof testimonies.$inferSelect;
export type NewTestimony = typeof testimonies.$inferInsert;
