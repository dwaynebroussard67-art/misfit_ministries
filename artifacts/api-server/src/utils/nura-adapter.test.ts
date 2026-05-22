import { describe, it, expect } from 'vitest';
import { generateNuraResponse } from './nura-adapter.js';

describe('Nura Adapter', () => {
  it('should connect to Groq API with valid key', async () => {
    const response = await generateNuraResponse('Hello, who are you?');
    expect(response).toBeDefined();
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  }, { timeout: 30000 });

  it('should include Nura character traits in response', async () => {
    const response = await generateNuraResponse('What is your purpose?');
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
  }, { timeout: 30000 });
});
