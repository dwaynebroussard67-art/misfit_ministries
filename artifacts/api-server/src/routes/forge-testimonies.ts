import { Router, Request, Response } from 'express';
import { getDb, testimonies } from '@workspace/db';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

const updateTestimonySchema = z.object({
  approved: z.boolean().optional(),
  featured: z.boolean().optional(),
  notes: z.string().optional(),
});

// GET /api/forge/testimonies - List all testimonies
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const allTestimonies = await db.select().from(testimonies)
      .orderBy(desc(testimonies.created_at));

    res.json({
      total: allTestimonies.length,
      approved: allTestimonies.filter(t => t.approved).length,
      pending: allTestimonies.filter(t => !t.approved).length,
      featured: allTestimonies.filter(t => t.featured).length,
      testimonies: allTestimonies,
    });
  } catch (error) {
    console.error('Error fetching testimonies:', error);
    res.status(500).json({ error: 'Failed to fetch testimonies' });
  }
});

// GET /api/forge/testimonies/pending - List pending testimonies
router.get('/pending', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const pending = await db.select().from(testimonies)
      .where(eq(testimonies.approved, false))
      .orderBy(desc(testimonies.created_at));

    res.json({ count: pending.length, testimonies: pending });
  } catch (error) {
    console.error('Error fetching pending testimonies:', error);
    res.status(500).json({ error: 'Failed to fetch testimonies' });
  }
});

// PATCH /api/forge/testimonies/:id - Update testimony
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const parsed = updateTestimonySchema.parse(req.body);
    const db = await getDb();

    await db.update(testimonies).set(parsed)
      .where(eq(testimonies.id, parseInt(req.params.id)));

    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error updating testimony:', error);
    res.status(500).json({ error: 'Failed to update testimony' });
  }
});

// DELETE /api/forge/testimonies/:id - Delete testimony
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    await db.delete(testimonies).where(eq(testimonies.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimony:', error);
    res.status(500).json({ error: 'Failed to delete testimony' });
  }
});

export default router;
