import { mysqlTable, serial, int, text, timestamp } from 'drizzle-orm/mysql-core';
import { narcanResponders } from './narcan_responders.js';

export const responderStories = mysqlTable('responder_stories', {
  id: serial('id').primaryKey(),
  responder_id: int('responder_id').notNull(),
  title: text('title').notNull(),
  story: text('story').notNull(),
  lives_saved: int('lives_saved').default(1),
  featured: text('featured').default('false'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export type ResponderStory = typeof responderStories.$inferSelect;
export type NewResponderStory = typeof responderStories.$inferInsert;
