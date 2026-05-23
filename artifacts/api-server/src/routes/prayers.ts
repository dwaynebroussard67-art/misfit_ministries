import { Router, Request, Response } from 'express';
import { getDb, prayers } from '@workspace/db';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { detectCrisisKeywords } from '../utils/crisis-detection.js';
import { requireForge } from '../middleware/forge-auth.js';
import { sendCrisisAlert } from '../utils/email-service.js';

const router: ReturnType<typeof Router> = Router();

const PRAYER_CATEGORIES = [
  'family',
  'health',
  'finances',
  'spiritual-growth',
  'relationships',
  'work',
  'addiction-recovery',
  'housing',
  'legal',
  'other',
];

const createPrayerSchema = z.object({
  name: z.string().optional(),
  request: z.string().min(1),
  category: z.string().optional(),
  is_anonymous: z.boolean().optional().default(false),
});

// GET /api/prayers - List all prayers
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const category = req.query.category as string | undefined;
    const status = req.query.status as string | undefined;

    let query: any = db.select().from(prayers);
    if (category && PRAYER_CATEGORIES.includes(category)) {
      query = query.where(eq(prayers.category, category));
    }
    if (status && ['pending', 'answered', 'archived'].includes(status)) {
      query = query.where(eq(prayers.status, status));
    }

    const result = await query.orderBy(desc(prayers.created_at));
    res.json(result);
  } catch (error) {
    console.error('Error fetching prayers:', error);
    res.status(500).json({ error: 'Failed to fetch prayers' });
  }
});

// GET /api/prayers/categories - Get available prayer categories
router.get('/categories', (req: Request, res: Response) => {
  res.json({ categories: PRAYER_CATEGORIES });
});

// POST /api/prayers - Submit a prayer
router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = createPrayerSchema.parse(req.body);
    
    if (parsed.category && !PRAYER_CATEGORIES.includes(parsed.category)) {
      res.status(400).json({ error: `Invalid category. Must be one of: ${PRAYER_CATEGORIES.join(', ')}` });
      return;
    }
    
    const { crisis_flag, keywords } = detectCrisisKeywords(parsed.request);

    const db = await getDb();
    const result = await db.insert(prayers).values({
      name: parsed.is_anonymous ? null : parsed.name,
      request: parsed.request,
      category: parsed.category || 'other',
      is_anonymous: parsed.is_anonymous,
      crisis_flag: crisis_flag,
      flagged_keywords: crisis_flag ? keywords.join(', ') : null,
    });

    if (crisis_flag) {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@misfitministries.com';
      const prayerName = parsed.name || 'Anonymous';
      try {
        await sendCrisisAlert(adminEmail, prayerName, keywords);
      } catch (emailError) {
        console.error('Failed to send crisis alert email:', emailError);
      }
    }

    res.status(201).json({
      success: true,
      crisis_flag: crisis_flag,
      message: crisis_flag ? 'Prayer submitted. Crisis detected. 988 resources available.' : 'Prayer submitted.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Error creating prayer:', error);
    res.status(500).json({ error: 'Failed to create prayer' });
  }
});

// PATCH /api/prayers/:id/status - Update prayer status (Forge only)
router.patch('/:id/status', requireForge, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid prayer ID' });
      return;
    }
    const { status } = req.body;

    if (!['pending', 'answered', 'archived'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const db = await getDb();
    await db.update(prayers).set({ status }).where(eq(prayers.id, id));

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating prayer status:', error);
    res.status(500).json({ error: 'Failed to update prayer' });
  }
});

// PATCH /api/prayers/:id/pray - Increment prayer count
router.patch('/:id/pray', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const db = await getDb();

    const prayer = await db.select().from(prayers).where(eq(prayers.id, id));
    if (!prayer.length) {
      res.status(404).json({ error: 'Prayer not found' });
      return;
    }

    await db.update(prayers).set({
      prayer_count: (prayer[0].prayer_count || 0) + 1,
    }).where(eq(prayers.id, id));

    res.json({ success: true, prayer_count: (prayer[0].prayer_count || 0) + 1 });
  } catch (error) {
    console.error('Error incrementing prayer count:', error);
    res.status(500).json({ error: 'Failed to increment prayer count' });
  }
});

// DELETE /api/prayers/:id - Delete a prayer (Forge only)
router.delete('/:id', requireForge, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const db = await getDb();

    await db.delete(prayers).where(eq(prayers.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting prayer:', error);
    res.status(500).json({ error: 'Failed to delete prayer' });
  }
});

export default router;
