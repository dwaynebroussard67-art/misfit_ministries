import { Router, Request, Response } from 'express';
import { getDb, resources } from '@workspace/db';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { requireForge } from '../middleware/forge-auth.js';

const router: ReturnType<typeof Router> = Router();

const createResourceSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  phone: z.string().optional(),
  url: z.string().optional(),
  available_247: z.boolean().optional().default(false),
  order: z.number().optional().default(0),
});

// GET /api/resources - List all resources
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const category = req.query.category as string | undefined;

    let query: any = db.select().from(resources);
    if (category) query = query.where(eq(resources.category, category));

    const result = await query.orderBy(resources.order, desc(resources.created_at));
    res.json(result);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// POST /api/resources - Create resource (Forge only)
router.post('/', requireForge, async (req: Request, res: Response) => {
  try {
    const parsed = createResourceSchema.parse(req.body);
    const db = await getDb();

    await db.insert(resources).values(parsed);
    res.status(201).json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Failed to create resource' });
  }
});

// PATCH /api/resources/:id - Update resource (Forge only)
router.patch('/:id', requireForge, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid resource ID' });
      return;
    }
    const parsed = createResourceSchema.partial().parse(req.body);

    const db = await getDb();
    await db.update(resources).set(parsed).where(eq(resources.id, id));

    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Error updating resource:', error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

// DELETE /api/resources/:id - Delete resource (Forge only)
router.delete('/:id', requireForge, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid resource ID' });
      return;
    }
    const db = await getDb();

    await db.delete(resources).where(eq(resources.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

export default router;
