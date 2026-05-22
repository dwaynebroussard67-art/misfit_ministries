import { mysqlTable, serial, text, int, timestamp } from 'drizzle-orm/mysql-core';

export const orders = mysqlTable('orders', {
  id: serial('id').primaryKey(),
  stripe_session_id: text('stripe_session_id').unique(),
  printify_order_id: text('printify_order_id').unique(),
  customer_email: text('customer_email'),
  amount: int('amount'), // in cents
  status: text('status').default('pending'), // 'pending', 'completed', 'shipped', 'delivered', 'failed'
  tracking_number: text('tracking_number'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
