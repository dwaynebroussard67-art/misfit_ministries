import { describe, it, expect } from 'vitest';
import { generateForgeToken, verifyForgeToken } from './forge-auth.js';

describe('Forge Authentication', () => {
  it('should generate a valid token', () => {
    const token = generateForgeToken('988', 'test-secret');
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('should verify a valid token', () => {
    const passphrase = '988';
    const secret = 'test-secret';
    const token = generateForgeToken(passphrase, secret);
    const isValid = verifyForgeToken(token, passphrase, secret);
    expect(isValid).toBe(true);
  });

  it('should reject an invalid token', () => {
    const passphrase = '988';
    const secret = 'test-secret';
    const token = generateForgeToken(passphrase, secret);
    const isValid = verifyForgeToken(token, 'wrong-passphrase', secret);
    expect(isValid).toBe(false);
  });

  it('should use timing-safe comparison', () => {
    const token1 = generateForgeToken('988', 'secret');
    const token2 = generateForgeToken('988', 'secret');
    expect(token1).toBe(token2);
  });
});
