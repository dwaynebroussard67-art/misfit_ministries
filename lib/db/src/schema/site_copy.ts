import { mysqlTable, text, timestamp } from 'drizzle-orm/mysql-core';

export const siteCopy = mysqlTable('site_copy', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  description: text('description'),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export type SiteCopy = typeof siteCopy.$inferSelect;
export type NewSiteCopy = typeof siteCopy.$inferInsert;
