import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface GroqHealthStatus {
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  timestamp: string;
  error?: string;
}

/**
 * Check Groq API health by making a simple request
 */
export async function checkGroqHealth(): Promise<GroqHealthStatus> {
  const startTime = Date.now();
  
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: 'ping',
        },
      ],
      max_tokens: 10,
      temperature: 0,
    });

    const latency = Date.now() - startTime;

    if (response.choices[0]?.message?.content) {
      return {
        status: latency > 5000 ? 'degraded' : 'healthy',
        latency,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      status: 'degraded',
      latency,
      timestamp: new Date().toISOString(),
      error: 'No response content',
    };
  } catch (error) {
    const latency = Date.now() - startTime;
    return {
      status: 'down',
      latency,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get Groq health status (cached for 30 seconds)
 */
let cachedHealth: GroqHealthStatus | null = null;
let lastHealthCheck = 0;
const CACHE_DURATION = 30000; // 30 seconds

export async function getGroqHealthStatus(): Promise<GroqHealthStatus> {
  const now = Date.now();

  if (cachedHealth && now - lastHealthCheck < CACHE_DURATION) {
    return cachedHealth;
  }

  cachedHealth = await checkGroqHealth();
  lastHealthCheck = now;

  return cachedHealth;
}
