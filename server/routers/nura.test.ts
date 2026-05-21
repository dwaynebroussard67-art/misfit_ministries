import { describe, it, expect, vi } from "vitest";
import { nuraRouter } from "./nura";

describe("nuraRouter", () => {
  describe("chat", () => {
    it("should respond to normal messages without crisis flag", async () => {
      const caller = nuraRouter.createCaller({} as any);
      
      const result = await caller.chat({
        message: "How can I find peace in my life?",
        sessionId: "test-session-1",
      });

      expect(result).toHaveProperty("message");
      expect(result).toHaveProperty("isCrisis");
      expect(result.isCrisis).toBe(false);
      expect(result.message).toBeTruthy();
      expect(typeof result.message).toBe("string");
    });

    it("should detect crisis keywords and set isCrisis flag", async () => {
      const caller = nuraRouter.createCaller({} as any);
      
      const result = await caller.chat({
        message: "I want to kill myself",
        sessionId: "test-session-2",
      });

      expect(result.isCrisis).toBe(true);
      expect(result.message).toContain("988");
      expect(result.message).toContain("Suicide & Crisis Lifeline");
    });

    it("should include 988 in crisis response", async () => {
      const caller = nuraRouter.createCaller({} as any);
      
      const result = await caller.chat({
        message: "I want to kill myself",
        sessionId: "test-session-3",
      });

      expect(result.isCrisis).toBe(true);
      expect(result.message).toContain("988");
      expect(result.message).toContain("Jesus");
    });

    it("should handle overdose keywords", async () => {
      const caller = nuraRouter.createCaller({} as any);
      
      const result = await caller.chat({
        message: "I'm going to overdose",
        sessionId: "test-session-4",
      });

      expect(result.isCrisis).toBe(true);
    });

    it("should handle self-harm keywords", async () => {
      const caller = nuraRouter.createCaller({} as any);
      
      const result = await caller.chat({
        message: "I want to cut myself",
        sessionId: "test-session-5",
      });

      expect(result.isCrisis).toBe(true);
    });

    it("should always include Jesus in response", async () => {
      const caller = nuraRouter.createCaller({} as any);
      
      const result = await caller.chat({
        message: "What should I do with my life?",
        sessionId: "test-session-6",
      });

      expect(result.message.toLowerCase()).toContain("jesus");
    });
  });
});
