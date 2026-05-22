import { Router, Request, Response } from 'express';
import { getDb, narcanResponders } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

const registerResponderSchema = z.object({
  user_id: z.string().min(1),
  name: z.string().optional(),
  phone: z.string().optional(),
  narcan_count: z.number().optional().default(0),
});

const updateResponderSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  narcan_count: z.number().optional(),
  is_active: z.boolean().optional(),
});

// POST /api/narcan/register - Register as Misfit First Responder
router.post('/register', async (req: Request, res: Response) => {
  try {
    const parsed = registerResponderSchema.parse(req.body);
    const db = await getDb();

    // Check if already registered
    const existing = await db.select().from(narcanResponders)
      .where(eq(narcanResponders.user_id, parsed.user_id));

    if (existing.length > 0) {
      res.status(400).json({ error: 'Already registered as responder' });
      return;
    }

    await db.insert(narcanResponders).values({
      user_id: parsed.user_id,
      name: parsed.name,
      phone: parsed.phone,
      narcan_count: parsed.narcan_count,
      is_active: true,
    });

    res.status(201).json({ success: true, message: 'Registered as Misfit First Responder' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error registering responder:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
});

// GET /api/narcan/responder/:userId - Get responder profile
router.get('/responder/:userId', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const responder = await db.select().from(narcanResponders)
      .where(eq(narcanResponders.user_id, req.params.userId));

    if (!responder.length) {
      res.status(404).json({ error: 'Responder not found' });
      return;
    }

    res.json(responder[0]);
  } catch (error) {
    console.error('Error fetching responder:', error);
    res.status(500).json({ error: 'Failed to fetch responder' });
  }
});

// PATCH /api/narcan/responder/:userId - Update responder profile
router.patch('/responder/:userId', async (req: Request, res: Response) => {
  try {
    const parsed = updateResponderSchema.parse(req.body);
    const db = await getDb();

    await db.update(narcanResponders).set(parsed)
      .where(eq(narcanResponders.user_id, req.params.userId));

    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error updating responder:', error);
    res.status(500).json({ error: 'Failed to update responder' });
  }
});

// GET /api/narcan/stats - Get responder network stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const responders = await db.select().from(narcanResponders);

    const stats = {
      total_responders: responders.length,
      active_responders: responders.filter(r => r.is_active).length,
      total_narcan: responders.reduce((sum, r) => sum + (r.narcan_count || 0), 0),
      total_saves: responders.reduce((sum, r) => sum + (r.saves_count || 0), 0),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
