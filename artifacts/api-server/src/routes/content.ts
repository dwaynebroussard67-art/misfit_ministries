import { Router, Request, Response } from 'express';
import { getDb, content } from '@workspace/db';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { requireForge } from '../middleware/forge-auth.js';

const router: ReturnType<typeof Router> = Router();

const createContentSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['post', 'page', 'announcement', 'bg_image']),
  slug: z.string().min(1),
  body: z.string().optional(),
  excerpt: z.string().optional(),
  published: z.boolean().optional().default(false),
  featured_image: z.string().optional(),
  order: z.number().optional().default(0),
});

// GET /api/content - List content
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const type = req.query.type as string | undefined;
    const published = req.query.published === 'true';

    let query: any = db.select().from(content);
    if (type) query = query.where(eq(content.type, type));
    if (published) query = query.where(eq(content.published, true));

    const result = await query.orderBy(content.order, desc(content.created_at));
    res.json(result);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// POST /api/content - Create content (Forge only)
router.post('/', requireForge, async (req: Request, res: Response) => {
  try {
    const parsed = createContentSchema.parse(req.body);
    const db = await getDb();

    await db.insert(content).values(parsed);
    res.status(201).json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Error creating content:', error);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

// PATCH /api/content/:id - Update content (Forge only)
router.patch('/:id', requireForge, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const parsed = createContentSchema.partial().parse(req.body);

    const db = await getDb();
    await db.update(content).set(parsed).where(eq(content.id, id));

    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// DELETE /api/content/:id - Delete content (Forge only)
router.delete('/:id', requireForge, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const db = await getDb();

    await db.delete(content).where(eq(content.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

export default router;
