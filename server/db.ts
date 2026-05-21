import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, prayers, InsertPrayer, testimonies, InsertTestimony, resources, InsertResource, siteCopy, InsertSiteCopy, nuraConversations, InsertNuraConversation, content, InsertContent } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ PRAYERS ============
export async function createPrayer(data: InsertPrayer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(prayers).values(data);
  return result;
}

export async function getPrayers(filters?: { category?: string; status?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  let query = db.select().from(prayers) as any;
  
  const conditions = [];
  if (filters?.category) conditions.push(eq(prayers.category, filters.category));
  if (filters?.status) conditions.push(eq(prayers.status, filters.status));
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  
  return await query.orderBy(desc(prayers.createdAt));
}

export async function getPrayerById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(prayers).where(eq(prayers.id, id)).limit(1);
  return result[0];
}

export async function updatePrayer(id: number, data: Partial<InsertPrayer>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(prayers).set(data).where(eq(prayers.id, id));
}

export async function deletePrayer(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(prayers).where(eq(prayers.id, id));
}

// ============ TESTIMONIES ============
export async function createTestimony(data: InsertTestimony) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(testimonies).values(data);
}

export async function getTestimonies(approved?: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  let query = db.select().from(testimonies) as any;
  if (approved !== undefined) {
    query = query.where(eq(testimonies.approved, approved));
  }
  return await query.orderBy(desc(testimonies.createdAt));
}

export async function getTestimonyById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(testimonies).where(eq(testimonies.id, id)).limit(1);
  return result[0];
}

export async function updateTestimony(id: number, data: Partial<InsertTestimony>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(testimonies).set(data).where(eq(testimonies.id, id));
}

export async function deleteTestimony(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(testimonies).where(eq(testimonies.id, id));
}

// ============ RESOURCES ============
export async function createResource(data: InsertResource) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(resources).values(data);
}

export async function getResources(category?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  let query = db.select().from(resources) as any;
  if (category) {
    query = query.where(eq(resources.category, category));
  }
  return await query.orderBy(resources.order);
}

export async function getResourceById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(resources).where(eq(resources.id, id)).limit(1);
  return result[0];
}

export async function updateResource(id: number, data: Partial<InsertResource>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(resources).set(data).where(eq(resources.id, id));
}

export async function deleteResource(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(resources).where(eq(resources.id, id));
}

// ============ SITE COPY ============
export async function getSiteCopy(key?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (key) {
    const result = await db.select().from(siteCopy).where(eq(siteCopy.key, key)).limit(1);
    return result[0];
  }
  return db.select().from(siteCopy);
}

export async function setSiteCopy(key: string, value: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(siteCopy).values({ key, value, description }).onDuplicateKeyUpdate({
    set: { value, description: description || undefined }
  });
}

export async function deleteSiteCopy(key: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(siteCopy).where(eq(siteCopy.key, key));
}

// ============ NURA CONVERSATIONS ============
export async function createNuraConversation(data: InsertNuraConversation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(nuraConversations).values(data);
}

export async function getNuraConversationBySessionId(sessionId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(nuraConversations).where(eq(nuraConversations.sessionId, sessionId)).limit(1);
  return result[0];
}

export async function updateNuraConversation(sessionId: string, data: Partial<InsertNuraConversation>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(nuraConversations).set(data).where(eq(nuraConversations.sessionId, sessionId));
}

// ============ CONTENT ============
export async function createContent(data: InsertContent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(content).values(data);
}

export async function getContent(filters?: { type?: string; published?: boolean }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  let query = db.select().from(content) as any;
  
  const conditions = [];
  if (filters?.type) conditions.push(eq(content.type, filters.type));
  if (filters?.published !== undefined) conditions.push(eq(content.published, filters.published));
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  
  return await query.orderBy(desc(content.createdAt));
}

export async function getContentBySlug(slug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(content).where(eq(content.slug, slug)).limit(1);
  return result[0];
}

export async function getContentById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(content).where(eq(content.id, id)).limit(1);
  return result[0];
}

export async function updateContent(id: number, data: Partial<InsertContent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(content).set(data).where(eq(content.id, id));
}

export async function deleteContent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(content).where(eq(content.id, id));
}
