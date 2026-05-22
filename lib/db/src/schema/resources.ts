import { mysqlTable, serial, text, boolean, int, timestamp } from 'drizzle-orm/mysql-core';

export const resources = mysqlTable('resources', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  phone: text('phone'),
  url: text('url'),
  available_247: boolean('available_247').default(false),
  order: int('order').default(0),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;
