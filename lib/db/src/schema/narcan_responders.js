import { mysqlTable, serial, text, boolean, int, timestamp } from 'drizzle-orm/mysql-core';
export const narcanResponders = mysqlTable('narcan_responders', {
    id: serial('id').primaryKey(),
    user_id: text('user_id').notNull().unique(),
    name: text('name'),
    phone: text('phone'),
    narcan_count: int('narcan_count').default(0),
    is_active: boolean('is_active').default(true),
    saves_count: int('saves_count').default(0),
    last_location_update: timestamp('last_location_update'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});
