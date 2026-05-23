import { Router, Request, Response } from 'express';

const router = Router();

// Create content
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { title, body, type } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ error: 'Missing title or body' });
    }

    res.json({ created: true, id: Math.random().toString(36).substr(2, 9) });
  } catch (error) {
    console.error('Content Creator error:', error);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

export default router;
