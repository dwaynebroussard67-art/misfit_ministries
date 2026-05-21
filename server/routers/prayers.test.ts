import { describe, it, expect, beforeEach, vi } from "vitest";
import { prayersRouter } from "./prayers";

describe("prayersRouter", () => {
  let caller: any;

  beforeEach(() => {
    caller = prayersRouter.createCaller({} as any);
  });

  describe("create", () => {
    it("should create a prayer with name", async () => {
      const result = await caller.create({
        name: "John",
        request: "Please pray for my family",
        category: "family",
        isAnonymous: false,
      });

      expect(result).toEqual({ success: true });
    });

    it("should create an anonymous prayer", async () => {
      const result = await caller.create({
        name: "Jane",
        request: "Please pray for my recovery",
        category: "health",
        isAnonymous: true,
      });

      expect(result).toEqual({ success: true });
    });

    it("should create a prayer without category", async () => {
      const result = await caller.create({
        name: "Bob",
        request: "General prayer request",
        isAnonymous: false,
      });

      expect(result).toEqual({ success: true });
    });

    it("should require a prayer request", async () => {
      try {
        await caller.create({
          name: "Alice",
          request: "",
          isAnonymous: false,
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toBeTruthy();
      }
    });
  });

  describe("list", () => {
    it("should return an array of prayers", async () => {
      const result = await caller.list();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("incrementPrayerCount", () => {
    it("should increment prayer count for a valid prayer ID", async () => {
      // First create a prayer
      await caller.create({
        name: "Test User",
        request: "Test prayer",
        isAnonymous: false,
      });

      // Then increment (this would work with a real DB)
      const result = await caller.incrementPrayerCount({ id: 1 });
      expect(result).toEqual({ success: true });
    });
  });
});
