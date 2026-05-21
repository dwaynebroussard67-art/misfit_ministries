import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { siteCopy } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const siteCopyRouter = router({
  getAll: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const result = await db.select().from(siteCopy);
    return result;
  }),

  getByKey: publicProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(siteCopy)
        .where(eq(siteCopy.key, input.key))
        .limit(1);

      return result.length > 0 ? result[0] : null;
    }),

  set: publicProcedure
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ input }: any) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const existing = await db
        .select()
        .from(siteCopy)
        .where(eq(siteCopy.key, input.key))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(siteCopy)
          .set({ value: input.value, updatedAt: new Date() })
          .where(eq(siteCopy.key, input.key));
      } else {
        await db.insert(siteCopy).values({
          key: input.key,
          value: input.value,
        } as any);
      }

      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(siteCopy).where(eq(siteCopy.key, input.key));

      return { success: true };
    }),
});
