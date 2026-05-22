import { mysqlTable, serial, text, boolean, int, timestamp, decimal } from 'drizzle-orm/mysql-core';

export const narcanResponders = mysqlTable('narcan_responders', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().unique(),
  name: text('name'),
  phone: text('phone'),
  narcan_count: int('narcan_count').default(0),
  is_active: boolean('is_active').default(true),
  saves_count: int('saves_count').default(0),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  has_narcan: boolean('has_narcan').default(true),
  last_location_update: timestamp('last_location_update'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export type NarcanResponder = typeof narcanResponders.$inferSelect;
export type NewNarcanResponder = typeof narcanResponders.$inferInsert;
