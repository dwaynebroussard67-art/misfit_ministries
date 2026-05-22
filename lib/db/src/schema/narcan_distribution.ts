import { mysqlTable, serial, int, text, timestamp, foreignKey } from 'drizzle-orm/mysql-core';
import { narcanShipments } from './narcan_shipments.js';
import { narcanResponders } from './narcan_responders.js';

export const narcanDistribution = mysqlTable('narcan_distribution', {
  id: serial('id').primaryKey(),
  shipment_id: int('shipment_id').notNull(),
  responder_id: int('responder_id').notNull(),
  quantity_distributed: int('quantity_distributed').notNull(),
  distribution_date: timestamp('distribution_date'),
  pickup_location: text('pickup_location'),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => [
  foreignKey({
    columns: [table.shipment_id],
    foreignColumns: [narcanShipments.id],
  }),
  foreignKey({
    columns: [table.responder_id],
    foreignColumns: [narcanResponders.id],
  }),
]);

export type NarcanDistribution = typeof narcanDistribution.$inferSelect;
export type NewNarcanDistribution = typeof narcanDistribution.$inferInsert;
