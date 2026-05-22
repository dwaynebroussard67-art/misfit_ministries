import { mysqlTable, serial, int, text, real, timestamp, foreignKey } from 'drizzle-orm/mysql-core';
import { odAlerts } from './od_alerts.js';
import { narcanResponders } from './narcan_responders.js';

export const odResponses = mysqlTable('od_responses', {
  id: serial('id').primaryKey(),
  alert_id: int('alert_id').notNull(),
  responder_id: int('responder_id').notNull(),
  status: text('status').default('responding'),
  distance_miles: real('distance_miles'),
  eta_seconds: int('eta_seconds'),
  arrived_at: timestamp('arrived_at'),
  narcan_administered: text('narcan_administered'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  fk_alert: foreignKey({
    columns: [table.alert_id],
    foreignColumns: [odAlerts.id],
  }),
  fk_responder: foreignKey({
    columns: [table.responder_id],
    foreignColumns: [narcanResponders.id],
  }),
}));

export type OdResponse = typeof odResponses.$inferSelect;
export type NewOdResponse = typeof odResponses.$inferInsert;
