import { mysqlTable, serial, text, timestamp, boolean, int } from 'drizzle-orm/mysql-core';

export const videoTestimonials = mysqlTable('video_testimonials', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  user_name: text('user_name'),
  video_url: text('video_url').notNull(), // S3 URL
  thumbnail_url: text('thumbnail_url'),
  title: text('title'),
  description: text('description'),
  duration_seconds: int('duration_seconds'),
  is_anonymous: boolean('is_anonymous').default(false),
  status: text('status').default('pending'), // 'pending', 'approved', 'rejected'
  moderation_notes: text('moderation_notes'),
  moderated_by: text('moderated_by'),
  moderated_at: timestamp('moderated_at'),
  published_at: timestamp('published_at'),
  view_count: int('view_count').default(0),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const videoUploadSessions = mysqlTable('video_upload_sessions', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  upload_token: text('upload_token').notNull().unique(),
  file_name: text('file_name'),
  file_size: int('file_size'),
  mime_type: text('mime_type'),
  upload_progress: int('upload_progress').default(0),
  status: text('status').default('uploading'), // 'uploading', 'processing', 'completed', 'failed'
  s3_key: text('s3_key'),
  error_message: text('error_message'),
  expires_at: timestamp('expires_at'),
  created_at: timestamp('created_at').defaultNow(),
});

export type VideoTestimonial = typeof videoTestimonials.$inferSelect;
export type NewVideoTestimonial = typeof videoTestimonials.$inferInsert;
export type VideoUploadSession = typeof videoUploadSessions.$inferSelect;
export type NewVideoUploadSession = typeof videoUploadSessions.$inferInsert;

