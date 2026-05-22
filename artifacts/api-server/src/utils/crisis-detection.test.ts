import { describe, it, expect } from 'vitest';
import { detectCrisisKeywords, shouldRefer988 } from './crisis-detection.js';

describe('Crisis Detection Utility', () => {
  describe('detectCrisisKeywords', () => {
    it('should detect suicide keywords', () => {
      const { isCrisis, keywords } = detectCrisisKeywords('I want to kill myself');
      expect(isCrisis).toBe(true);
      expect(keywords.includes('kill myself')).toBe(true);
    });

    it('should detect overdose keywords', () => {
      const { isCrisis, keywords } = detectCrisisKeywords('I am planning to overdose on heroin');
      expect(isCrisis).toBe(true);
      expect(keywords.some(k => k.includes('overdose') || k.includes('heroin'))).toBe(true);
    });

    it('should detect self-harm keywords', () => {
      const { isCrisis } = detectCrisisKeywords('I am cutting myself');
      expect(isCrisis).toBe(true);
    });

    it('should not flag normal text', () => {
      const { isCrisis } = detectCrisisKeywords('I am praying for healing');
      expect(isCrisis).toBe(false);
    });

    it('should be case insensitive', () => {
      const { isCrisis } = detectCrisisKeywords('I WANT TO KILL MYSELF');
      expect(isCrisis).toBe(true);
    });
  });

  describe('shouldRefer988', () => {
    it('should refer to 988 for suicide', () => {
      expect(shouldRefer988('I am suicidal')).toBe(true);
    });

    it('should refer to 988 for overdose', () => {
      expect(shouldRefer988('I am going to overdose')).toBe(true);
    });

    it('should not refer for normal text', () => {
      expect(shouldRefer988('Please pray for me')).toBe(false);
    });
  });
});
