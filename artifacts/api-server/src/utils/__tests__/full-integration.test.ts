import { describe, it, expect } from 'vitest';
import { detectCrisisKeywords, shouldRefer988 } from '../crisis-detection';

describe('Full Integration Tests', () => {
  describe('Crisis Detection', () => {
    it('should detect suicide keywords', () => {
      const result = detectCrisisKeywords('I want to kill myself');
      expect(result.crisis_flag).toBe(true);
      expect(result.keywords.length).toBeGreaterThan(0);
    });

    it('should detect self-harm keywords', () => {
      const result = detectCrisisKeywords('I am cutting myself');
      expect(result.crisis_flag).toBe(true);
    });

    it('should detect overdose keywords', () => {
      const result = detectCrisisKeywords('I took too many pills');
      expect(result.crisis_flag).toBe(true);
    });

    it('should not flag normal text', () => {
      const result = detectCrisisKeywords('I am having a great day');
      expect(result.crisis_flag).toBe(false);
    });

    it('should be case insensitive', () => {
      const result = detectCrisisKeywords('I WANT TO DIE');
      expect(result.crisis_flag).toBe(true);
    });

    it('should handle empty strings', () => {
      const result = detectCrisisKeywords('');
      expect(result.crisis_flag).toBe(false);
    });

    it('should return flagged keywords', () => {
      const result = detectCrisisKeywords('I want to kill myself');
      expect(result.keywords).toContain('kill myself');
    });

    it('should handle multiple crisis indicators', () => {
      const result = detectCrisisKeywords('I am suicidal and want to die');
      expect(result.crisis_flag).toBe(true);
      expect(result.keywords.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('988 Referral', () => {
    it('should refer to 988 for suicide keywords', () => {
      const result = shouldRefer988('I want to kill myself');
      expect(result).toBe(true);
    });

    it('should refer to 988 for overdose keywords', () => {
      const result = shouldRefer988('I took too many pills');
      expect(result).toBe(true);
    });

    it('should not refer for normal text', () => {
      const result = shouldRefer988('I am having a great day');
      expect(result).toBe(false);
    });

    it('should refer for emergency keywords', () => {
      const result = shouldRefer988('This is an emergency');
      expect(result).toBe(true);
    });
  });
});
