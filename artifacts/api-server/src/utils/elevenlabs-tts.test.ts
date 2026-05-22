import { describe, it, expect } from 'vitest';
import { generateNuraVoice, getAvailableVoices } from './elevenlabs-tts.js';

describe('ElevenLabs TTS', () => {
  it('should validate API key by fetching available voices', async () => {
    const voices = await getAvailableVoices();
    expect(voices).toBeDefined();
    expect(Array.isArray(voices)).toBe(true);
    expect(voices.length).toBeGreaterThan(0);
  }, { timeout: 10000 });

  it('should generate audio for Nura voice', async () => {
    const audio = await generateNuraVoice({
      text: 'Hello, I am Nura. How can I help you today?',
    });
    expect(audio).toBeDefined();
    expect(Buffer.isBuffer(audio)).toBe(true);
    expect(audio.length).toBeGreaterThan(0);
  }, { timeout: 15000 });
});
