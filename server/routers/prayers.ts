import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { prayers } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const prayersRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        request: z.string(),
        category: z.string().optional(),
        isAnonymous: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(prayers).values({
        name: input.isAnonymous ? null : input.name,
        request: input.request,
        category: input.category || null,
        isAnonymous: input.isAnonymous,
        prayerCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { success: true };
    }),

  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const result = await db.select().from(prayers).orderBy(prayers.createdAt);
    return result;
  }),

  incrementPrayerCount: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const prayer = await db
        .select()
        .from(prayers)
        .where(eq(prayers.id, input.id))
        .limit(1);

      if (!prayer.length) throw new Error("Prayer not found");

      await db
        .update(prayers)
        .set({
          prayerCount: (prayer[0].prayerCount || 0) + 1,
          updatedAt: new Date(),
        })
        .where(eq(prayers.id, input.id));

      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(prayers).where(eq(prayers.id, input.id));

      return { success: true };
    }),
});
