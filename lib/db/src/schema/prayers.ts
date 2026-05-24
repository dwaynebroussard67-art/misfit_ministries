import { mysqlTable, serial, text, boolean, int, timestamp, decimal } from 'drizzle-orm/mysql-core';

export const prayers = mysqlTable('prayers', {
  id: serial('id').primaryKey(),
  name: text('name'),
  request: text('request').notNull(),
  category: text('category'),
  status: text('status').default('pending'),
  prayer_count: int('prayer_count').default(0),
  is_anonymous: boolean('is_anonymous').default(false),
  crisis_flag: boolean('crisis_flag').default(false),
  flagged_keywords: text('flagged_keywords'),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  deletedAt: timestamp('deleted_at'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export type Prayer = typeof prayers.$inferSelect;
export type NewPrayer = typeof prayers.$inferInsert;
