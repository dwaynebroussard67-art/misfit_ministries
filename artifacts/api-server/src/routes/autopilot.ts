import { Router, Request, Response } from 'express';
import { getDb, autopilotContent } from '@workspace/db';
import { eq, desc } from 'drizzle-orm';
import { requireForge } from '../middleware/forge-auth.js';
import { startAutopilot, stopAutopilot, runAutopilot, getAutopilotStatus } from '../utils/autopilot-scheduler.js';

const router: ReturnType<typeof Router> = Router();

// GET /api/forge/autopilot/status - Get autopilot status
router.get('/status', requireForge, async (req: Request, res: Response) => {
  try {
    const status = await getAutopilotStatus();
    res.json(status);
  } catch (error) {
    console.error('Error getting autopilot status:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
});

// POST /api/forge/autopilot/start - Start autopilot
router.post('/start', requireForge, (req: Request, res: Response) => {
  try {
    startAutopilot();
    res.json({ success: true, message: 'Autopilot started' });
  } catch (error) {
    console.error('Error starting autopilot:', error);
    res.status(500).json({ error: 'Failed to start autopilot' });
  }
});

// POST /api/forge/autopilot/stop - Stop autopilot
router.post('/stop', requireForge, (req: Request, res: Response) => {
  try {
    stopAutopilot();
    res.json({ success: true, message: 'Autopilot stopped' });
  } catch (error) {
    console.error('Error stopping autopilot:', error);
    res.status(500).json({ error: 'Failed to stop autopilot' });
  }
});

// POST /api/forge/autopilot/run-now - Run immediately
router.post('/run-now', requireForge, async (req: Request, res: Response) => {
  try {
    await runAutopilot();
    res.json({ success: true, message: 'Autopilot ran' });
  } catch (error) {
    console.error('Error running autopilot:', error);
    res.status(500).json({ error: 'Failed to run autopilot' });
  }
});

// GET /api/forge/autopilot/content - List generated content
router.get('/content', requireForge, async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const content = await db.select().from(autopilotContent)
      .orderBy(desc(autopilotContent.generated_at));

    res.json(content);
  } catch (error) {
    console.error('Error fetching autopilot content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// PATCH /api/forge/autopilot/content/:id - Approve or reject
router.patch('/content/:id', requireForge, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (!['approved', 'rejected', 'posted'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const db = await getDb();
    await db.update(autopilotContent).set({ status }).where(eq(autopilotContent.id, id));

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

export default router;
