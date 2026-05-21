import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { content } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const contentRouter = router({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        slug: z.string(),
        type: z.enum(["post", "announcement", "article"]),
        excerpt: z.string().optional(),
        body: z.string(),
        published: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(content).values({
        title: input.title,
        slug: input.slug,
        type: input.type,
        excerpt: input.excerpt || null,
        body: input.body,
        published: input.published,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { success: true };
    }),

  list: publicProcedure
    .input(z.object({ published: z.boolean().optional() }).optional())
    .query(async ({ input }: any) => {
      const db = await getDb();
      if (!db) return [];

      let query = db.select().from(content) as any;

      if (input?.published) {
        query = query.where(eq(content.published, true));
      }

      const result = await query.orderBy(content.createdAt);
      return result;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(content)
        .where(eq(content.slug, input.slug))
        .limit(1);

      return result.length > 0 ? result[0] : null;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        excerpt: z.string().optional(),
        body: z.string().optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updates: any = { updatedAt: new Date() };
      if (input.title) updates.title = input.title;
      if (input.excerpt !== undefined) updates.excerpt = input.excerpt;
      if (input.body) updates.body = input.body;
      if (input.published !== undefined) updates.published = input.published;

      await db.update(content).set(updates).where(eq(content.id, input.id));

      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(content).where(eq(content.id, input.id));

      return { success: true };
    }),
});
