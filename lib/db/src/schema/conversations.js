import { mysqlTable, serial, text, timestamp } from 'drizzle-orm/mysql-core';
export const conversations = mysqlTable('conversations', {
    id: serial('id').primaryKey(),
    session_id: text('session_id').notNull(),
    title: text('title'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});
