import { Router, Request, Response } from 'express';
import { getDb, nuraConversations } from '@workspace/db';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { generateNuraResponse, ChatMessage } from '../utils/nura-adapter.js';
import { detectCrisisKeywords, shouldRefer988 } from '../utils/crisis-detection.js';
import { requireForge } from '../middleware/forge-auth.js';

const router = Router();

const nuraMessageSchema = z.object({
  message: z.string().min(1),
  sessionId: z.string().min(1),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().default([]),
});

// POST /api/nura/chat - Send message to Nura
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const parsed = nuraMessageSchema.parse(req.body);
    const db = await getDb();

    // Check for crisis keywords
    const { isCrisis, keywords } = detectCrisisKeywords(parsed.message);
    const refer988 = shouldRefer988(parsed.message);

    // Update or create session metadata
    const existing = await db.select().from(nuraConversations)
      .where(eq(nuraConversations.session_id, parsed.sessionId));

    if (existing.length > 0) {
      await db.update(nuraConversations).set({
        message_count: (existing[0].message_count || 0) + 1,
        last_message: new Date().toISOString(),
        crisis_flag: isCrisis || existing[0].crisis_flag,
        crisis_flagged_at: isCrisis ? new Date() : existing[0].crisis_flagged_at,
        crisis_keywords: isCrisis ? keywords.join(', ') : existing[0].crisis_keywords,
      }).where(eq(nuraConversations.session_id, parsed.sessionId));
    } else {
      await db.insert(nuraConversations).values({
        session_id: parsed.sessionId,
        message_count: 1,
        last_message: new Date().toISOString(),
        crisis_flag: isCrisis,
        crisis_flagged_at: isCrisis ? new Date() : null,
        crisis_keywords: isCrisis ? keywords.join(', ') : null,
      });
    }

    // Generate Nura response
    let reply = await generateNuraResponse(parsed.message, parsed.history);

    // Add 988 reference if crisis detected
    if (refer988) {
      reply += '\n\n**If you are in immediate danger, please call 988 (Suicide & Crisis Lifeline) right now. They have trained counselors available 24/7.**';
    }

    res.json({
      reply,
      crisis_flag: isCrisis,
      refer_988: refer988,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error in Nura chat:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// GET /api/nura/backend - Get active backend info
router.get('/backend', (req: Request, res: Response) => {
  res.json({
    backend: 'groq',
    model: 'llama-3.3-70b-versatile',
    status: 'active',
  });
});

// GET /api/nura/sessions - List session metadata (Forge only)
router.get('/sessions', requireForge, async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const sessions = await db.select().from(nuraConversations)
      .orderBy(desc(nuraConversations.updated_at));

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching Nura sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// GET /api/nura/stats - Session analytics (Forge only)
router.get('/stats', requireForge, async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const sessions = await db.select().from(nuraConversations);

    const stats = {
      total_sessions: sessions.length,
      total_messages: sessions.reduce((sum, s) => sum + (s.message_count || 0), 0),
      crisis_flags: sessions.filter(s => s.crisis_flag).length,
      avg_messages_per_session: sessions.length > 0 
        ? Math.round(sessions.reduce((sum, s) => sum + (s.message_count || 0), 0) / sessions.length)
        : 0,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching Nura stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
