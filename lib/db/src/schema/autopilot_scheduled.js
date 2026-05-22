import { mysqlTable, serial, text, timestamp, int } from 'drizzle-orm/mysql-core';
export const autopilotScheduled = mysqlTable('autopilot_scheduled', {
    id: serial('id').primaryKey(),
    content_id: int('content_id'),
    title: text('title').notNull(),
    body: text('body').notNull(),
    platforms: text('platforms').notNull(), // JSON array: ['twitter', 'facebook', 'instagram', 'linkedin']
    scheduled_for: timestamp('scheduled_for').notNull(),
    status: text('status').default('pending'), // 'pending', 'approved', 'published', 'failed'
    approved_by: text('approved_by'),
    approved_at: timestamp('approved_at'),
    published_at: timestamp('published_at'),
    error_message: text('error_message'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});
