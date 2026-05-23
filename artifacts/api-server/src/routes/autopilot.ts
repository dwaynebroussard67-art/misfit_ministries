import { Router, Request, Response } from 'express';
import { db } from '../db';

const router = Router();

// Schedule content publication
router.post('/schedule', async (req: Request, res: Response) => {
  try {
    const { content, publishAt } = req.body;
    
    if (!content || !publishAt) {
      return res.status(400).json({ error: 'Missing content or publishAt' });
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
