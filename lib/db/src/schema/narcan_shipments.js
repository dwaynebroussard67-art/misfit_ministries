import { mysqlTable, serial, text, int, timestamp } from 'drizzle-orm/mysql-core';
export const narcanShipments = mysqlTable('narcan_shipments', {
    id: serial('id').primaryKey(),
    shipment_id: text('shipment_id').unique(),
    source: text('source').notNull(), // 'government', 'donation', 'purchase'
    quantity: int('quantity').notNull(),
    status: text('status').default('pending'), // 'pending', 'in_transit', 'received', 'distributed'
    origin_location: text('origin_location'),
    destination_location: text('destination_location'),
    tracking_number: text('tracking_number'),
    expected_arrival: timestamp('expected_arrival'),
    actual_arrival: timestamp('actual_arrival'),
    distributed_at: timestamp('distributed_at'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});
