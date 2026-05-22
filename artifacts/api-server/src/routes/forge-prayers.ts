import { Router, Request, Response } from 'express';
import { getDb, prayers } from '@workspace/db';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

const updatePrayerSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  notes: z.string().optional(),
});

// GET /api/forge/prayers - List all prayers (admin only)
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const allPrayers = await db.select().from(prayers)
      .orderBy(desc(prayers.created_at));

    res.json({
      total: allPrayers.length,
      crisis_count: allPrayers.filter(p => p.isCrisis).length,
      pending: allPrayers.filter(p => !p.isCrisis).length,
      prayers: allPrayers,
    });
  } catch (error) {
    console.error('Error fetching prayers:', error);
    res.status(500).json({ error: 'Failed to fetch prayers' });
  }
});

// GET /api/forge/prayers/crisis - List crisis prayers
router.get('/crisis', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const crisisPrayers = await db.select().from(prayers)
      .where(eq(prayers.isCrisis, true))
      .orderBy(desc(prayers.created_at));

    res.json({
      count: crisisPrayers.length,
      prayers: crisisPrayers,
    });
  } catch (error) {
    console.error('Error fetching crisis prayers:', error);
    res.status(500).json({ error: 'Failed to fetch crisis prayers' });
  }
});

// PATCH /api/forge/prayers/:id - Update prayer status
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const parsed = updatePrayerSchema.parse(req.body);
    const db = await getDb();

    await db.update(prayers).set(parsed)
      .where(eq(prayers.id, parseInt(req.params.id)));

    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error updating prayer:', error);
    res.status(500).json({ error: 'Failed to update prayer' });
  }
});

// DELETE /api/forge/prayers/:id - Delete prayer
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    await db.delete(prayers).where(eq(prayers.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting prayer:', error);
    res.status(500).json({ error: 'Failed to delete prayer' });
  }
});

export default router;
