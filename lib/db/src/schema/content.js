import { mysqlTable, serial, text, boolean, int, timestamp } from 'drizzle-orm/mysql-core';
export const content = mysqlTable('content', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    type: text('type').notNull(),
    slug: text('slug').notNull().unique(),
    body: text('body'),
    excerpt: text('excerpt'),
    published: boolean('published').default(false),
    featured_image: text('featured_image'),
    order: int('order').default(0),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});
