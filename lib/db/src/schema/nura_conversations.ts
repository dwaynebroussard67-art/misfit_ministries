import { mysqlTable, serial, text, int, boolean, timestamp } from 'drizzle-orm/mysql-core';

export const nuraConversations = mysqlTable('nuraConversations', {
  id: serial('id').primaryKey(),
  session_id: text('sessionId').notNull().unique(),
  message_count: int('messageCount').default(0),
  last_message: text('lastMessage'),
  crisis_flag: boolean('crisisFlag').default(false),
  crisis_flagged_at: timestamp('crisisFlaggedAt'),
  crisis_keywords: text('crisisKeywords'),
  created_at: timestamp('createdAt').defaultNow(),
  updated_at: timestamp('updatedAt').defaultNow().onUpdateNow(),
});

export type NuraConversation = typeof nuraConversations.$inferSelect;
export type NewNuraConversation = typeof nuraConversations.$inferInsert;

// Note: Database columns use camelCase naming (sessionId, messageCount, etc.)
// Drizzle field names map to the actual database column names
