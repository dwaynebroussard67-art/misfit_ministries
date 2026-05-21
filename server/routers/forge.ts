import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { createHmac } from "crypto";

const FORGE_PASSPHRASE = process.env.FORGE_PASSPHRASE || "misfit-ministries-forge";

function generateToken(): string {
  return Math.random().toString(36).substr(2) + Date.now().toString(36);
}

function hashPassphrase(passphrase: string): string {
  return createHmac("sha256", "nura-forge-salt").update(passphrase).digest("hex");
}

export const forgeRouter = router({
  authenticate: publicProcedure
    .input(z.object({ passphrase: z.string() }))
    .mutation(async ({ input }) => {
      const expectedHash = hashPassphrase(FORGE_PASSPHRASE);
      const providedHash = hashPassphrase(input.passphrase);

      if (providedHash !== expectedHash) {
        throw new Error("Invalid passphrase");
      }

      const token = generateToken();
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

      return {
        token,
        expiresAt,
      };
    }),
});
