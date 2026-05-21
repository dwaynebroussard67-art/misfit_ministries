import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { resources } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const resourcesRouter = router({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        phone: z.string().optional(),
        url: z.string().optional(),
        category: z.string().optional(),
        available247: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }: any) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(resources).values({
        title: input.title,
        description: input.description || null,
        phone: input.phone || null,
        url: input.url || null,
        category: input.category || "other",
        available247: input.available247,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      return { success: true };
    }),

  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const result = await db.select().from(resources).orderBy(resources.category);
    return result;
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        phone: z.string().optional(),
        url: z.string().optional(),
        category: z.string().optional(),
        available247: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updates: any = { updatedAt: new Date() };
      if (input.title) updates.title = input.title;
      if (input.description !== undefined) updates.description = input.description;
      if (input.phone !== undefined) updates.phone = input.phone;
      if (input.url !== undefined) updates.url = input.url;
      if (input.category !== undefined) updates.category = input.category;
      if (input.available247 !== undefined) updates.available247 = input.available247;

      await db.update(resources).set(updates).where(eq(resources.id, input.id));

      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(resources).where(eq(resources.id, input.id));

      return { success: true };
    }),
});
