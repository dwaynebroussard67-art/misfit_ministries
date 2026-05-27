import { Router, Request, Response } from 'express';
import type { Router as ExpressRouter } from 'express';
import { db } from '../db/index.js';

const router: ExpressRouter = Router();

// Schedule content publication
router.post('/schedule', async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, publishAt } = req.body;
    
    if (!content || !publishAt) {
      res.status(400).json({ error: 'Missing content or publishAt' });
      return;
    }

    // Store scheduled content
    console.log(`Scheduled content for ${publishAt}:`, content);
    res.json({ scheduled: true, publishAt });
  } catch (error) {
    console.error('Autopilot error:', error);
    res.status(500).json({ error: 'Failed to schedule content' });
  }
});

export default router;
