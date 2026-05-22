import { mysqlTable, serial, int, text, timestamp, foreignKey } from 'drizzle-orm/mysql-core';
import { conversations } from './conversations.js';
export const messages = mysqlTable('messages', {
    id: serial('id').primaryKey(),
    conversation_id: int('conversation_id').notNull(),
    role: text('role').notNull(),
    content: text('content').notNull(),
    created_at: timestamp('created_at').defaultNow(),
}, (table) => [
    foreignKey({
        columns: [table.conversation_id],
        foreignColumns: [conversations.id],
    }),
]);
