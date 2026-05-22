import { Router, Request, Response } from 'express';
import { getDb, content, siteCopy } from '@workspace/db';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const router: ReturnType<typeof Router> = Router();

const updateContentSchema = z.object({
  title: z.string().optional(),
  body: z.string().optional(),
  published: z.boolean().optional(),
});

const updateSiteCopySchema = z.object({
  value: z.string(),
});

// GET /api/forge/content - List all content pages
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const allContent = await db.select().from(content)
      .orderBy(desc(content.created_at));

    res.json({
      total: allContent.length,
      published: allContent.filter(c => c.published).length,
      draft: allContent.filter(c => !c.published).length,
      content: allContent,
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// POST /api/forge/content - Create new content page
router.post('/', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      slug: z.string().min(1),
      title: z.string().min(1),
      body: z.string(),
    });
    const parsed = schema.parse(req.body);
    const db = await getDb();

    await db.insert(content).values({
      slug: parsed.slug,
      title: parsed.title,
      body: parsed.body,
      published: false,
    });

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

// PATCH /api/forge/content/:id - Update content
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const parsed = updateContentSchema.parse(req.body);
    const db = await getDb();

    await db.update(content).set(parsed)
      .where(eq(content.id, parseInt(req.params.id)));

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

// DELETE /api/forge/content/:id - Delete content
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    await db.delete(content).where(eq(content.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

// GET /api/forge/site-copy - Get all site copy
router.get('/site-copy', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const copy = await db.select().from(siteCopy);
    res.json(copy);
  } catch (error) {
    console.error('Error fetching site copy:', error);
    res.status(500).json({ error: 'Failed to fetch site copy' });
  }
});

// PUT /api/forge/site-copy/:key - Update site copy
router.put('/site-copy/:key', async (req: Request, res: Response) => {
  try {
    const parsed = updateSiteCopySchema.parse(req.body);
    const db = await getDb();

    await db.update(siteCopy).set({ value: parsed.value })
      .where(eq(siteCopy.key, req.params.key));

    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Error updating site copy:', error);
    res.status(500).json({ error: 'Failed to update site copy' });
  }
});

export default router;
