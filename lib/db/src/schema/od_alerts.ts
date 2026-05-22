import { mysqlTable, serial, text, real, timestamp } from 'drizzle-orm/mysql-core';

export const odAlerts = mysqlTable('od_alerts', {
  id: serial('id').primaryKey(),
  lat: real('lat').notNull(),
  lng: real('lng').notNull(),
  location_description: text('location_description'),
  status: text('status').default('active'),
  created_at: timestamp('created_at').defaultNow(),
  resolved_at: timestamp('resolved_at'),
});

export type OdAlert = typeof odAlerts.$inferSelect;
export type NewOdAlert = typeof odAlerts.$inferInsert;
