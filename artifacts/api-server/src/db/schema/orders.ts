import { mysqlTable, int, varchar, timestamp, json, index } from 'drizzle-orm/mysql-core';

export const orders = mysqlTable(
  'orders',
  {
    id: int('id').primaryKey().autoincrement(),
    user_id: varchar('user_id', { length: 255 }).notNull(),
    stripe_payment_intent_id: varchar('stripe_payment_intent_id', { length: 255 }).notNull().unique(),
    stripe_session_id: varchar('stripe_session_id', { length: 255 }),
    amount: int('amount').notNull(),
    currency: varchar('currency', { length: 10 }).default('usd'),
    status: varchar('status', { length: 50 }).default('pending'),
    customer_email: varchar('customer_email', { length: 255 }),
    metadata: json('metadata'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  table => ({
    userIdIdx: index('idx_user_id').on(table.user_id),
    statusIdx: index('idx_status').on(table.status),
  }),
);
