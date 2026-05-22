import { Router, Request, Response } from 'express';
import { getDb, responderStories } from '@workspace/db';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

const storySchema = z.object({
  responder_id: z.number(),
  title: z.string().min(1),
  story: z.string().min(10),
  lives_saved: z.number().optional().default(1),
});

// POST /api/stories - Submit responder story
router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = storySchema.parse(req.body);
    const db = await getDb();

    await db.insert(responderStories).values({
      responder_id: parsed.responder_id,
      title: parsed.title,
      story: parsed.story,
      lives_saved: parsed.lives_saved,
    });

    res.status(201).json({ success: true, message: 'Story submitted' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error('Error submitting story:', error);
    res.status(500).json({ error: 'Failed to submit story' });
  }
});

// GET /api/stories - Get all stories (community feed)
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const stories = await db.select().from(responderStories)
      .orderBy(desc(responderStories.created_at))
      .limit(50);

    res.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// GET /api/stories/featured - Get featured stories
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const stories = await db.select().from(responderStories)
      .where(eq(responderStories.featured, 'true'))
      .orderBy(desc(responderStories.created_at))
      .limit(10);

    res.json(stories);
  } catch (error) {
    console.error('Error fetching featured stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// GET /api/stories/:id - Get single story
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const story = await db.select().from(responderStories)
      .where(eq(responderStories.id, parseInt(req.params.id)));

    if (!story.length) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    res.json(story[0]);
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ error: 'Failed to fetch story' });
  }
});

export default router;
