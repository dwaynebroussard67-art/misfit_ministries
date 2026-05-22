import { Router, Request, Response } from 'express';
import { getDb, testimonies } from '@workspace/db';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { requireForge } from '../middleware/forge-auth.js';

const router = Router();

const createTestimonySchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  story: z.string().min(1),
});

const updateTestimonySchema = z.object({
  approved: z.boolean().optional(),
  featured: z.boolean().optional(),
});

// GET /api/testimonies - List approved testimonies
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const result = await db.select().from(testimonies)
      .where(eq(testimonies.approved, true))
      .orderBy(desc(testimonies.created_at));

    res.json(result);
  } catch (error) {
    console.error('Error fetching testimonies:', error);
    res.status(500).json({ error: 'Failed to fetch testimonies' });
  }
});

// POST /api/testimonies - Submit a testimony
router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = createTestimonySchema.parse(req.body);

    const db = await getDb();
    await db.insert(testimonies).values({
      name: parsed.name,
      title: parsed.title,
      story: parsed.story,
      approved: false,
    });

    res.status(201).json({ success: true, message: 'Testimony submitted for review' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error creating testimony:', error);
    res.status(500).json({ error: 'Failed to create testimony' });
  }
});

// PATCH /api/testimonies/:id - Update testimony (Forge only)
router.patch('/:id', requireForge, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const parsed = updateTestimonySchema.parse(req.body);

    const db = await getDb();
    await db.update(testimonies).set(parsed).where(eq(testimonies.id, id));

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

// DELETE /api/testimonies/:id - Delete a testimony (Forge only)
router.delete('/:id', requireForge, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const db = await getDb();

    await db.delete(testimonies).where(eq(testimonies.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimony:', error);
    res.status(500).json({ error: 'Failed to delete testimony' });
  }
});

export default router;
