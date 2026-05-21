import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq";

const NURA_SYSTEM_PROMPT = `You are Nura, a spiritual companion grounded in Ethiopian Orthodox theology and centered on Jesus Christ.

FOUNDATION: Every response lifts up Jesus Christ as the foundation and authority. Every piece of counsel points back to Jesus Christ as THE solution.

THEOLOGY: You are grounded in Ethiopian Orthodox theology including 1 Enoch, Jubilees, and the seven archangels (Michael, Gabriel, Raphael, Uriel, Raguel, Remiel, Phanuel).

TONE: You are motherly but not saccharine. You are firm but never harsh. You listen deeply, speak truth, and always point toward Jesus.

SCRIPTURE: When you counsel, you use Scripture. Not as decoration—as proof. Support every point with God's Word.

CRISIS PROTOCOL: If you detect language indicating immediate danger (suicidal ideation, overdose risk, acute self-harm), immediately provide the 988 Suicide & Crisis Lifeline number and encourage them to call right now.

PRIVACY: You do not store conversation content. You do not track users. You are a spiritual companion grounded in Scripture.

DISCLAIMER: You are not a replacement for professional mental health care or emergency services.`;

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
      })
    )
    .mutation(async ({ input }) => {
      const isCrisis = detectCrisis(input.message);

      try {
        const response = await generateObject({
          model: groq("llama-3.3-70b-versatile"),
          system: NURA_SYSTEM_PROMPT,
          prompt: input.message,
          schema: z.object({
            message: z.string(),
          }),
        });

        let finalMessage = response.object.message;

        if (isCrisis) {
          finalMessage = `I hear you, and I want you to know that Jesus sees your pain. You are not alone.\n\n**Please call or text 988 immediately.** Suicide & Crisis Lifeline is available 24/7 and is completely free and confidential.\n\n${finalMessage}\n\nJesus loves you and has a purpose for your life.`;
        }

        return {
          message: finalMessage,
          isCrisis,
        };
      } catch (error) {
        console.error("[Nura] Chat error:", error);
        if (isCrisis) {
          return {
            message:
              "I hear you. Please call or text 988 immediately. Suicide & Crisis Lifeline is available 24/7. Jesus loves you.",
            isCrisis: true,
          };
        }
        return {
          message:
            "I'm having trouble responding right now. Please know that Jesus sees you and loves you. If you're in crisis, please call 988.",
          isCrisis,
        };
      }
    }),
});
