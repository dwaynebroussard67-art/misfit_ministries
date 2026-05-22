import { Router, Request, Response } from 'express';
import { requireForge } from '../middleware/forge-auth.js';
import { startMediaGenerator, stopMediaGenerator, generateContent, getGeneratorStatus } from '../utils/media-generator.js';

const router = Router();

// GET /api/forge/media/status - Get generator status
router.get('/status', requireForge, async (req: Request, res: Response) => {
  try {
    const status = await getGeneratorStatus();
    res.json(status);
  } catch (error) {
    console.error('Error getting generator status:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
});

// POST /api/forge/media/generate - Generate content immediately
router.post('/generate', requireForge, async (req: Request, res: Response) => {
  try {
    await generateContent();
    res.json({ success: true, message: 'Content generated' });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// POST /api/forge/media/start - Start scheduled generation
router.post('/start', requireForge, (req: Request, res: Response) => {
  try {
    startMediaGenerator();
    res.json({ success: true, message: 'Content Creator started' });
  } catch (error) {
    console.error('Error starting generator:', error);
    res.status(500).json({ error: 'Failed to start generator' });
  }
});

// POST /api/forge/media/stop - Stop scheduled generation
router.post('/stop', requireForge, (req: Request, res: Response) => {
  try {
    stopMediaGenerator();
    res.json({ success: true, message: 'Content Creator stopped' });
  } catch (error) {
    console.error('Error stopping generator:', error);
    res.status(500).json({ error: 'Failed to stop generator' });
  }
});

export default router;
