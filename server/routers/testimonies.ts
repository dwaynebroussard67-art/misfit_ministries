import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { testimonies } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const testimoniesRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        title: z.string().optional(),
        story: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(testimonies).values({
        name: input.name || null,
        title: input.title || null,
        story: input.story,
        approved: false,
        featured: false,
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

      let query = db.select().from(testimonies) as any;

      if (input?.approved) {
        query = query.where(eq(testimonies.approved, true));
      }

      const result = await query.orderBy(testimonies.createdAt);
      return result;
    }),

  approve: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(testimonies)
        .set({ approved: true, updatedAt: new Date() })
        .where(eq(testimonies.id, input.id));

      return { success: true };
    }),

  feature: publicProcedure
    .input(z.object({ id: z.number(), featured: z.boolean() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(testimonies)
        .set({ featured: input.featured, updatedAt: new Date() })
        .where(eq(testimonies.id, input.id));

      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(testimonies).where(eq(testimonies.id, input.id));

      return { success: true };
    }),
});
