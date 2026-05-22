import { mysqlTable, serial, text, timestamp, int } from 'drizzle-orm/mysql-core';
export const auditLogs = mysqlTable('audit_logs', {
    id: serial('id').primaryKey(),
    admin_id: text('admin_id').notNull(),
    admin_email: text('admin_email'),
    action: text('action').notNull(), // 'prayer_approved', 'prayer_rejected', 'testimony_approved', etc.
    entity_type: text('entity_type').notNull(), // 'prayer', 'testimony', 'content', 'user', etc.
    entity_id: int('entity_id'),
    old_value: text('old_value'), // JSON string of previous state
    new_value: text('new_value'), // JSON string of new state
    reason: text('reason'), // Why the action was taken
    ip_address: text('ip_address'),
    user_agent: text('user_agent'),
    created_at: timestamp('created_at').defaultNow(),
});
