import { describe, it, expect } from 'vitest';
import { detectCrisisKeywords } from '../crisis-detection.js';

describe('Crisis Detection', () => {
  it('should detect suicide keywords', () => {
    const text = 'I want to kill myself';
    const result = detectCrisisKeywords(text);
    expect(result.crisis_flag).toBe(true);
    expect(result.keywords.length).toBeGreaterThan(0);
  });

  it('should detect self-harm keywords', () => {
    const text = 'I am cutting myself';
    const result = detectCrisisKeywords(text);
    expect(result.crisis_flag).toBe(true);
  });

  it('should detect overdose keywords', () => {
    const text = 'I took too many pills';
    const result = detectCrisisKeywords(text);
    expect(result.crisis_flag).toBe(true);
  });

  it('should detect abuse keywords', () => {
    const text = 'My partner is abusing me';
    const result = detectCrisisKeywords(text);
    expect(result.crisis_flag).toBe(true);
  });

  it('should not flag normal text', () => {
    const text = 'I am having a great day';
    const result = detectCrisisKeywords(text);
    expect(result.crisis_flag).toBe(false);
  });

  it('should be case insensitive', () => {
    const text = 'I WANT TO DIE';
    const result = detectCrisisKeywords(text);
    expect(result.crisis_flag).toBe(true);
  });

  it('should handle empty strings', () => {
    const text = '';
    const result = detectCrisisKeywords(text);
    expect(result.crisis_flag).toBe(false);
  });

  it('should return flagged keywords', () => {
    const text = 'I want to kill myself and hurt others';
    const result = detectCrisisKeywords(text);
    expect(result.keywords).toContain('kill myself');
    expect(result.keywords.length).toBeGreaterThan(0);
  });

  it('should handle multiple crisis indicators', () => {
    const text = 'I am suicidal and want to die';
    const result = detectCrisisKeywords(text);
    expect(result.crisis_flag).toBe(true);
    expect(result.keywords.length).toBeGreaterThanOrEqual(1);
  });
});
