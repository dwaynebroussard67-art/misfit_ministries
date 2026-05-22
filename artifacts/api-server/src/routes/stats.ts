import { Router, Request, Response } from 'express';
import { getDb, prayers, testimonies, nuraConversations } from '@workspace/db';
import { desc } from 'drizzle-orm';

const router: ReturnType<typeof Router> = Router();

// GET /api/stats/overview - Get overview stats
router.get('/overview', async (req: Request, res: Response) => {
  try {
    const db = await getDb();

    const prayerCount = await db.select().from(prayers);
    const testimonyCount = await db.select().from(testimonies);
    const sessionCount = await db.select().from(nuraConversations);

    const stats = {
      total_prayers: prayerCount.length,
      crisis_prayers: prayerCount.filter(p => p.crisis_flag).length,
      total_testimonies: testimonyCount.length,
      approved_testimonies: testimonyCount.filter(t => t.approved).length,
      nura_sessions: sessionCount.length,
      total_nura_messages: sessionCount.reduce((sum, s) => sum + (s.message_count || 0), 0),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/stats/activity - Get recent activity feed
router.get('/activity', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const limit = parseInt(req.query.limit as string) || 20;

    const recentPrayers = await db.select().from(prayers)
      .orderBy(desc(prayers.created_at))
      .limit(limit);

    const recentTestimonies = await db.select().from(testimonies)
      .orderBy(desc(testimonies.created_at))
      .limit(limit);

    const activity = [
      ...recentPrayers.map(p => ({
        type: 'prayer',
        id: p.id,
        title: p.request.substring(0, 50),
        crisis: p.crisis_flag,
        created_at: p.created_at,
      })),
      ...recentTestimonies.map(t => ({
        type: 'testimony',
        id: t.id,
        title: t.title || t.story.substring(0, 50),
        approved: t.approved,
        created_at: t.created_at,
      })),
    ].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    }).slice(0, limit);

    res.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

export default router;
