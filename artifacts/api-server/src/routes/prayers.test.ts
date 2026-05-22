import { describe, it, expect } from 'vitest';
import { detectCrisisKeywords } from '../utils/crisis-detection.js';

describe('Prayer Crisis Detection', () => {
  it('should detect suicide keywords', () => {
    const { isCrisis, keywords } = detectCrisisKeywords('I want to kill myself');
    expect(isCrisis).toBe(true);
    expect(keywords.length).toBeGreaterThan(0);
  });

  it('should detect overdose keywords', () => {
    const { isCrisis, keywords } = detectCrisisKeywords('I am planning to overdose');
    expect(isCrisis).toBe(true);
    expect(keywords.includes('overdose')).toBe(true);
  });

  it('should not flag normal prayers', () => {
    const { isCrisis } = detectCrisisKeywords('Please pray for my healing and recovery');
    expect(isCrisis).toBe(false);
  });

  it('should handle multiple crisis keywords', () => {
    const { isCrisis, keywords } = detectCrisisKeywords('I am suicidal and want to overdose');
    expect(isCrisis).toBe(true);
    expect(keywords.length).toBeGreaterThanOrEqual(2);
  });
});
