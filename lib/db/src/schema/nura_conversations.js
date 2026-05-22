import { mysqlTable, serial, text, int, boolean, timestamp } from 'drizzle-orm/mysql-core';
export const nuraConversations = mysqlTable('nura_conversations', {
    id: serial('id').primaryKey(),
    session_id: text('session_id').notNull().unique(),
    message_count: int('message_count').default(0),
    last_message: text('last_message'),
    crisis_flag: boolean('crisis_flag').default(false),
    crisis_flagged_at: timestamp('crisis_flagged_at'),
    crisis_keywords: text('crisis_keywords'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});
