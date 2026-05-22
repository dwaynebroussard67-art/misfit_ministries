import { mysqlTable, serial, text, timestamp, boolean } from 'drizzle-orm/mysql-core';

export const twoFactorAuth = mysqlTable('two_factor_auth', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().unique(),
  method: text('method').notNull(), // 'sms' or 'email'
  phone_number: text('phone_number'),
  email: text('email'),
  secret: text('secret'), // For TOTP
  is_enabled: boolean('is_enabled').default(false),
  backup_codes: text('backup_codes'), // JSON array of backup codes
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const twoFactorChallenges = mysqlTable('two_factor_challenges', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  code: text('code').notNull(),
  method: text('method').notNull(), // 'sms' or 'email'
  attempts: serial('attempts').default(0),
  max_attempts: serial('max_attempts').default(3),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

export type TwoFactorAuth = typeof twoFactorAuth.$inferSelect;
export type NewTwoFactorAuth = typeof twoFactorAuth.$inferInsert;
export type TwoFactorChallenge = typeof twoFactorChallenges.$inferSelect;
export type NewTwoFactorChallenge = typeof twoFactorChallenges.$inferInsert;
