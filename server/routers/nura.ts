import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { getDb } from "../db";
import { nuraConversations } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

// Ensure the API key is present at runtime
if (!process.env.GROQ_API_KEY) {
  console.warn("WARNING: GROQ_API_KEY is missing from environment.");
}

const NURA_BASE_SYSTEM_PROMPT = `You are Nura, an unvarnished, street-smart theological guide for Misfit Ministries. You treat this space like a hospital for the broken. Speak directly, with raw empathy and ancient Orthodox depth. Never mimic generic AI fluff. You are grounded in Ethiopian Orthodox theology including 1 Enoch, Jubilees, and the seven archangels. Every response lifts up Jesus Christ as the foundation. Every piece of counsel points back to Jesus Christ as THE solution. Use Scripture as proof, not decoration. If you detect immediate danger (suicidal ideation, overdose risk, acute self-harm), immediately provide the 988 Suicide & Crisis Lifeline number.`;

const CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "end it",
  "overdose",
  "cut myself",
  "harm myself",
  "self-harm",
  "want to die",
  "going to die",
  "emergency",
  "hospital",
  "911",
];

function detectCrisis(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => lowerMessage.includes(keyword));
}

export const nuraRouter = router({
  chat: publicProcedure
    .input(
      z.object({
        message: z.string(),
        sessionId: z.string(),
        userLocation: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { message, userLocation } = input;

        if (!message) {
          return {
            message: "Please share what's on your heart.",
            isCrisis: false,
          };
        }

        let brockResourceContext = "";

        // 1. Detect if the user is asking for nearby physical resources, harm reduction, or help
        const needsLocalHelp = /near me|closest|hospital|detox|shelter|clinic|find help/i.test(message);

        if (needsLocalHelp) {
          const locationString = userLocation ? `Coordinates/City: ${userLocation}` : "Unknown location (ask user for details)";

          try {
            // 2. Call Brock's Groq AI instance to rapidly process or pull local resource matches
            const groqResponse = await generateText({
              model: groq("llama-3.3-70b-versatile"),
              system: `You are an emergency crisis router database utility. Based on the user's location, output a strict Markdown list of the 2-3 closest harm-reduction centers, hospitals, or crisis detox locations with addresses and phone numbers. Keep it completely concise. Location context: ${locationString}`,
              prompt: `Find the absolute nearest emergency crisis and harm reduction resources for: "${message}"`,
            });

            if (groqResponse.text) {
              brockResourceContext = `\n\n[LOCAL CRISIS RESOURCES FOUND]:\n${groqResponse.text}`;
            }
          } catch (groqError) {
            console.error("Brock's Groq API call failed, continuing baseline fallback:", groqError);
            // Fail gracefully so the chat system doesn't crash if the external API hits a rate-limit
          }
        }

        // 3. Combine baseline prompt with Brock's dynamic resource payload if it was triggered
        const finalSystemPrompt = `${NURA_BASE_SYSTEM_PROMPT}${brockResourceContext}`;

        // 4. Send the final compiled package to Nura's LLM backend
        const nuraChatResponse = await generateText({
          model: groq("llama-3.3-70b-versatile"),
          system: finalSystemPrompt,
          prompt: message,
        });

        const isCrisis = detectCrisis(message);

        // 5. Persist conversation metadata (not content, for privacy)
        const db = await getDb();
        if (db && input.sessionId) {
          try {
            const existingSession = await db
              .select()
              .from(nuraConversations)
              .where(eq(nuraConversations.sessionId, input.sessionId))
              .limit(1);

            if (existingSession.length > 0) {
              await db
                .update(nuraConversations)
                .set({
                  messageCount: (existingSession[0].messageCount || 0) + 1,
                  crisisFlag: isCrisis || existingSession[0].crisisFlag,
                  crisisFlaggedAt: isCrisis && !existingSession[0].crisisFlag ? new Date() : existingSession[0].crisisFlaggedAt,
                  lastMessage: new Date(),
                })
                .where(eq(nuraConversations.sessionId, input.sessionId));
            } else {
              await db.insert(nuraConversations).values({
                sessionId: input.sessionId,
                messageCount: 1,
                crisisFlag: isCrisis,
                crisisFlaggedAt: isCrisis ? new Date() : null,
              });
            }
          } catch (dbError) {
            console.warn("Failed to persist conversation metadata:", dbError);
          }
        }

        // 6. Return the completed message cleanly back to the React UI frontend
        return {
          message: nuraChatResponse.text,
          resourcesInjected: needsLocalHelp,
          isCrisis,
          sessionId: input.sessionId,
        };
      } catch (error: any) {
        console.error("Critical error in Nura chat route processing:", error);
        return {
          message: "I'm having trouble responding right now. Please know that Jesus sees you and loves you. If you're in crisis, please call 988.",
          isCrisis: false,
        };
      }
    }),

  getSessions: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const sessions = await db
      .select()
      .from(nuraConversations)
      .orderBy(nuraConversations.createdAt);

    return sessions;
  }),

  getSessionStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { totalSessions: 0, crisisSessions: 0, avgMessages: 0 };

    const sessions = await db.select().from(nuraConversations);
    const totalSessions = sessions.length;
    const crisisSessions = sessions.filter((s) => s.crisisFlag).length;
    const avgMessages =
      totalSessions > 0
        ? sessions.reduce((sum, s) => sum + (s.messageCount || 0), 0) / totalSessions
        : 0;

    return { totalSessions, crisisSessions, avgMessages: Math.round(avgMessages) };
  }),
});
