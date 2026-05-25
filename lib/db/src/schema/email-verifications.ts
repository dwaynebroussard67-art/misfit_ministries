import { mysqlTable, varchar, boolean, timestamp, index } from 'drizzle-orm/mysql-core';

export const emailVerifications = mysqlTable(
  'email_verifications',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    userId: varchar('user_id', { length: 36 }).notNull(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    verified: boolean('verified').default(false),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
    tokenIdx: index('token_idx').on(table.token),
    userIdIdx: index('user_id_idx').on(table.userId),
  })
);
