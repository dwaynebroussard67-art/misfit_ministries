import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, real, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Prayers table — community prayer wall submissions
 */
export const prayers = mysqlTable("prayers", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name"), // nullable — anonymous if null
  request: text("request").notNull(),
  category: varchar("category", { length: 50 }), // e.g. "addiction", "family"
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, answered, archived
  prayerCount: int("prayerCount").default(0).notNull(),
  isAnonymous: boolean("isAnonymous").default(false).notNull(),
  crisisFlag: boolean("crisisFlag").default(false).notNull(),
  flaggedKeywords: text("flaggedKeywords"), // comma-separated keywords that triggered flag
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  statusIdx: index("prayers_status_idx").on(table.status),
  crisisIdx: index("prayers_crisis_idx").on(table.crisisFlag),
}));

export type Prayer = typeof prayers.$inferSelect;
export type InsertPrayer = typeof prayers.$inferInsert;

/**
 * Testimonies table — story/testimony wall submissions
 */
export const testimonies = mysqlTable("testimonies", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name"), // nullable
  title: text("title"), // nullable
  story: text("story").notNull(),
  approved: boolean("approved").default(false).notNull(),
  autoApproved: boolean("autoApproved").default(false).notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  approvedIdx: index("testimonies_approved_idx").on(table.approved),
  featuredIdx: index("testimonies_featured_idx").on(table.featured),
}));

export type Testimony = typeof testimonies.$inferSelect;
export type InsertTestimony = typeof testimonies.$inferInsert;

/**
 * Resources table — crisis/mental health resource listings
 */
export const resources = mysqlTable("resources", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(), // e.g. "hotline", "counseling", "support-group"
  phone: varchar("phone", { length: 20 }),
  url: varchar("url", { length: 255 }),
  available247: boolean("available247").default(false).notNull(),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  categoryIdx: index("resources_category_idx").on(table.category),
  orderIdx: index("resources_order_idx").on(table.order),
}));

export type Resource = typeof resources.$inferSelect;
export type InsertResource = typeof resources.$inferInsert;

/**
 * Site Copy table — key-value store for all editable site text
 * DB starts empty; frontend falls back to hardcoded defaults
 */
export const siteCopy = mysqlTable("siteCopy", {
  key: varchar("key", { length: 255 }).primaryKey(), // dot-notation: "home.hero.headline"
  value: text("value").notNull(),
  description: text("description"), // admin-facing description
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteCopy = typeof siteCopy.$inferSelect;
export type InsertSiteCopy = typeof siteCopy.$inferInsert;

/**
 * Nura Conversations table — session metadata only
 * Actual conversation content is NEVER stored — only session-level metadata
 */
export const nuraConversations = mysqlTable("nuraConversations", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull().unique(), // localStorage session ID
  messageCount: int("messageCount").default(0).notNull(),
  lastMessage: timestamp("lastMessage"), // timestamp of last message
  crisisFlag: boolean("crisisFlag").default(false).notNull(),
  crisisFlaggedAt: timestamp("crisisFlaggedAt"),
  crisisKeywords: text("crisisKeywords"), // comma-separated keywords that triggered flag
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  sessionIdIdx: index("nuraConversations_sessionId_idx").on(table.sessionId),
  crisisIdx: index("nuraConversations_crisis_idx").on(table.crisisFlag),
}));

export type NuraConversation = typeof nuraConversations.$inferSelect;
export type InsertNuraConversation = typeof nuraConversations.$inferInsert;

/**
 * Content table — CMS for articles, posts, announcements, background images
 */
export const content = mysqlTable("content", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // "post", "page", "announcement", "bg_image"
  slug: varchar("slug", { length: 255 }).notNull().unique(), // used as URL key and image key
  body: text("body"), // rich text / markdown
  excerpt: text("excerpt"), // short summary
  published: boolean("published").default(false).notNull(),
  featuredImage: varchar("featuredImage", { length: 255 }), // URL
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  typeIdx: index("content_type_idx").on(table.type),
  slugIdx: index("content_slug_idx").on(table.slug),
  publishedIdx: index("content_published_idx").on(table.published),
}));

export type Content = typeof content.$inferSelect;
export type InsertContent = typeof content.$inferInsert;