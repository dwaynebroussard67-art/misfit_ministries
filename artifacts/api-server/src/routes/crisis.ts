import { Router, Request, Response } from 'express';
import { getDb, odAlerts } from '@workspace/db';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { requireForge } from '../middleware/forge-auth.js';

const router: ReturnType<typeof Router> = Router();

const odAlertSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  location_description: z.string().optional(),
});

// POST /api/crisis/od-alert - Submit OD alert
router.post('/od-alert', async (req: Request, res: Response) => {
  try {
    const parsed = odAlertSchema.parse(req.body);
    const db = await getDb();

    await db.insert(odAlerts).values({
      lat: parsed.lat,
      lng: parsed.lng,
      location_description: parsed.location_description,
      status: 'active',
    });

    res.status(201).json({ success: true, message: 'OD alert submitted' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Error creating OD alert:', error);
    res.status(500).json({ error: 'Failed to create OD alert' });
  }
});

// GET /api/crisis/od-alerts - List active OD alerts (Forge only)
router.get('/od-alerts', requireForge, async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const alerts = await db.select().from(odAlerts)
      .where(eq(odAlerts.status, 'active'))
      .orderBy(desc(odAlerts.created_at));

    res.json(alerts);
  } catch (error) {
    console.error('Error fetching OD alerts:', error);
    res.status(500).json({ error: 'Failed to fetch OD alerts' });
  }
});

// PATCH /api/crisis/od-alerts/:id/resolve - Mark alert resolved (Forge only)
router.patch('/od-alerts/:id/resolve', requireForge, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const db = await getDb();

    await db.update(odAlerts).set({
      status: 'resolved',
      resolved_at: new Date(),
    }).where(eq(odAlerts.id, id));

    res.json({ success: true });
  } catch (error) {
    console.error('Error resolving OD alert:', error);
    res.status(500).json({ error: 'Failed to resolve OD alert' });
  }
});

export default router;
