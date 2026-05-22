import { mysqlTable, serial, text, timestamp } from 'drizzle-orm/mysql-core';

export const autopilotContent = mysqlTable('autopilot_content', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  platform: text('platform'),
  content: text('content').notNull(),
  status: text('status').default('pending'),
  posted_at: timestamp('posted_at'),
  post_error: text('post_error'),
  generated_at: timestamp('generated_at'),
  created_at: timestamp('created_at').defaultNow(),
});

export type AutopilotContent = typeof autopilotContent.$inferSelect;
export type NewAutopilotContent = typeof autopilotContent.$inferInsert;
