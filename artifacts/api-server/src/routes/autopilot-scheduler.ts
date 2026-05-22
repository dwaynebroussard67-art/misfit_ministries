import { Router, Request, Response } from 'express';
import { getDb, autopilotScheduled } from '@workspace/db';
import { eq, desc, gte } from 'drizzle-orm';
import { z } from 'zod';

const router: ReturnType<typeof Router> = Router();

const scheduleContentSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(10),
  platforms: z.array(z.enum(['twitter', 'facebook', 'instagram', 'linkedin'])).min(1),
  scheduled_for: z.string(), // ISO date string
});

const approveContentSchema = z.object({
  approved_by: z.string(),
});

// POST /api/autopilot/schedule - Schedule content for publishing
router.post('/schedule', async (req: Request, res: Response) => {
  try {
    const parsed = scheduleContentSchema.parse(req.body);
    const db = await getDb();

    await db.insert(autopilotScheduled).values({
      title: parsed.title,
      body: parsed.body,
      platforms: JSON.stringify(parsed.platforms),
      scheduled_for: new Date(parsed.scheduled_for),
      status: 'pending',
    });

    res.status(201).json({ success: true, message: 'Content scheduled for approval' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Error scheduling content:', error);
    res.status(500).json({ error: 'Failed to schedule content' });
  }
});

// GET /api/autopilot/pending - Get pending content awaiting approval
router.get('/pending', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const pending = await db.select().from(autopilotScheduled)
      .where(eq(autopilotScheduled.status, 'pending'))
      .orderBy(desc(autopilotScheduled.scheduled_for));

    res.json(pending);
  } catch (error) {
    console.error('Error fetching pending content:', error);
    res.status(500).json({ error: 'Failed to fetch pending content' });
  }
});

// GET /api/autopilot/scheduled - Get all scheduled content
router.get('/scheduled', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const scheduled = await db.select().from(autopilotScheduled)
      .where(gte(autopilotScheduled.scheduled_for, new Date()))
      .orderBy(desc(autopilotScheduled.scheduled_for));

    res.json(scheduled);
  } catch (error) {
    console.error('Error fetching scheduled content:', error);
    res.status(500).json({ error: 'Failed to fetch scheduled content' });
  }
});

// PATCH /api/autopilot/:id/approve - Approve content for publishing
router.patch('/:id/approve', async (req: Request, res: Response) => {
  try {
    const parsed = approveContentSchema.parse(req.body);
    const db = await getDb();

    await db.update(autopilotScheduled).set({
      status: 'approved',
      approved_by: parsed.approved_by,
      approved_at: new Date(),
    }).where(eq(autopilotScheduled.id, parseInt(req.params.id)));

    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten().fieldErrors });
      return;
    }
    console.error('Error approving content:', error);
    res.status(500).json({ error: 'Failed to approve content' });
  }
});

// PATCH /api/autopilot/:id/reject - Reject content
router.patch('/:id/reject', async (req: Request, res: Response) => {
  try {
    const db = await getDb();

    await db.update(autopilotScheduled).set({
      status: 'failed',
      error_message: 'Rejected by moderator',
    }).where(eq(autopilotScheduled.id, parseInt(req.params.id)));

    res.json({ success: true });
  } catch (error) {
    console.error('Error rejecting content:', error);
    res.status(500).json({ error: 'Failed to reject content' });
  }
});

// DELETE /api/autopilot/:id - Delete scheduled content
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDb();

    await db.delete(autopilotScheduled)
      .where(eq(autopilotScheduled.id, parseInt(req.params.id)));

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

export default router;
